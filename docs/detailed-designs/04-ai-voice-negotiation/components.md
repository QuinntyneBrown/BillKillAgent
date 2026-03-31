# Feature 04: AI Voice Negotiation Agent -- Components

## NegotiationOrchestrator

The top-level coordinator for end-to-end negotiation workflows. Instantiated by the BullMQ worker when a negotiation job is dequeued.

**Responsibilities:**
- Loads subscription and provider data from PostgreSQL
- Invokes NegotiationStrategyPlanner to generate the negotiation plan
- Creates and configures VoiceCallManager, SpeechToTextStream, and TextToSpeechEngine
- Wires the real-time audio pipeline between Twilio, Deepgram, and ElevenLabs
- Instantiates and drives the ConversationStateMachine
- Handles top-level error recovery (retry on disconnect, timeout on hold)
- Persists the final NegotiationSession outcome to the database
- Emits events for real-time UI updates via Redis pub/sub

**Key Methods:**
- `execute(jobData: NegotiationJobData): Promise<NegotiationOutcome>` -- Main entry point
- `setupAudioPipeline(): Promise<void>` -- Connects STT/TTS streams to Twilio media
- `handleCallStateChange(state: CallState): void` -- Reacts to Twilio status callbacks
- `teardown(): Promise<void>` -- Cleans up all resources on completion or failure

**Dependencies:** NegotiationStrategyPlanner, VoiceCallManager, SpeechToTextStream, TextToSpeechEngine, ConversationStateMachine, NegotiationAgent, TranscriptLogger

---

## NegotiationStrategyPlanner

Uses Claude API to generate a tailored negotiation strategy before the call begins. This is a pre-call planning step that produces the playbook the NegotiationAgent follows during the conversation.

**Responsibilities:**
- Constructs a detailed prompt including: current bill amount, provider name, account tenure, usage patterns, market competitor rates, historical negotiation outcomes for this provider
- Calls Claude API with structured output to produce a NegotiationStrategy
- Validates strategy parameters (target savings within reasonable range, fallback thresholds make sense)
- Caches successful strategies per provider for reuse and iteration

**Key Methods:**
- `planStrategy(context: NegotiationContext): Promise<NegotiationStrategy>` -- Generates strategy
- `buildPrompt(context: NegotiationContext): string` -- Assembles Claude prompt
- `validateStrategy(strategy: NegotiationStrategy): boolean` -- Sanity checks

**Output -- NegotiationStrategy:**
```typescript
{
  targetSavingsPercent: number;       // e.g., 25 (25% reduction)
  minimumAcceptablePercent: number;   // e.g., 10 (walk away below 10%)
  leveragePoints: string[];           // e.g., ["competitor Verizon offers $49.99"]
  openingScript: string;              // first thing to say to agent
  escalationThreshold: number;        // rounds before requesting supervisor
  maxCallDuration: number;            // minutes before graceful exit
  providerSpecificTips: string[];     // known retention offers, dept names
}
```

**Dependencies:** Claude API client, ProviderKnowledgeBase (internal data on provider retention patterns)

---

## VoiceCallManager

Manages the full lifecycle of a Twilio outbound call, including media stream configuration for bidirectional audio.

**Responsibilities:**
- Creates outbound calls via Twilio REST API with TwiML configuration
- Configures Twilio Media Streams for real-time bidirectional audio via WebSocket
- Sends DTMF tones for IVR menu navigation
- Monitors call status via Twilio status callbacks (queued, ringing, in-progress, completed, failed, busy, no-answer)
- Enforces maximum call duration with automatic termination
- Handles call transfer detection (when provider transfers to another department)

**Key Methods:**
- `initiateCall(phoneNumber: string, config: CallConfig): Promise<string>` -- Returns call SID
- `sendDTMF(digits: string): Promise<void>` -- Sends touch-tone digits
- `getMediaStreamUrl(): string` -- Returns WebSocket URL for media stream
- `terminateCall(reason: string): Promise<void>` -- Gracefully ends call
- `onStatusChange(callback: (status: CallStatus) => void): void` -- Registers status listener

**Configuration:**
- Twilio account SID, auth token, outbound caller ID
- Media stream codec: mulaw, sample rate: 8000 Hz
- Status callback URL pointed at the BullMQ worker's HTTP endpoint
- Maximum call duration: configurable, default 30 minutes

**Dependencies:** Twilio SDK (`twilio`), IVoiceProvider interface

---

## SpeechToTextStream

Manages a persistent WebSocket connection to Deepgram's streaming transcription API. Receives raw audio from Twilio's media stream and produces real-time text transcriptions.

**Responsibilities:**
- Opens and maintains WebSocket connection to Deepgram streaming endpoint
- Receives mulaw 8kHz audio chunks from Twilio media stream and forwards to Deepgram
- Parses Deepgram response messages (interim results, final results, metadata)
- Emits transcription events with speaker identification and confidence scores
- Handles connection drops with automatic reconnection
- Tracks silence duration for turn-detection (endpointing)

**Key Methods:**
- `connect(config: STTConfig): Promise<void>` -- Opens Deepgram WebSocket
- `feedAudio(chunk: Buffer): void` -- Sends audio data to Deepgram
- `onTranscript(callback: (transcript: TranscriptEvent) => void): void` -- Registers listener
- `onUtteranceEnd(callback: () => void): void` -- Fires when speaker stops talking
- `disconnect(): void` -- Closes WebSocket cleanly

**TranscriptEvent:**
```typescript
{
  text: string;
  isFinal: boolean;
  confidence: number;
  speaker: number;       // 0 = provider agent, 1 = AI (echo detection)
  timestamp: number;     // milliseconds from call start
  words: Array<{ word: string; start: number; end: number; confidence: number }>;
}
```

**Configuration:**
- Model: `nova-2`
- Language: `en-US`
- Smart formatting: enabled
- Diarization: enabled (2 speakers)
- Endpointing: 500ms
- Interim results: enabled
- Encoding: `mulaw`, sample rate: `8000`

**Dependencies:** Deepgram SDK (`@deepgram/sdk`)

---

## TextToSpeechEngine

Converts text responses from the NegotiationAgent into natural-sounding speech audio using ElevenLabs streaming API, formatted for Twilio media stream playback.

**Responsibilities:**
- Sends text to ElevenLabs streaming TTS endpoint and receives audio chunks
- Converts audio format to mulaw 8kHz for Twilio compatibility
- Streams audio chunks directly into Twilio's media stream WebSocket
- Manages voice configuration (voice ID, stability, similarity boost, style)
- Handles interruption (stops current speech if provider starts talking)
- Queues responses to prevent overlapping speech

**Key Methods:**
- `synthesize(text: string): AsyncGenerator<Buffer>` -- Streams audio chunks
- `speakIntoCall(text: string, mediaStream: WebSocket): Promise<void>` -- Full pipeline
- `interrupt(): void` -- Stops current speech immediately
- `setVoice(voiceId: string): void` -- Changes voice profile

**Configuration:**
- Voice ID: pre-selected professional phone voice
- Model: `eleven_turbo_v2_5` for lowest latency
- Output format: `ulaw_8000` (native Twilio format)
- Stability: 0.6 (balanced natural variation)
- Similarity boost: 0.8 (consistent voice identity)
- Optimize streaming latency: level 3 (aggressive)

**Dependencies:** ElevenLabs SDK, audio format conversion utilities

---

## ConversationStateMachine

Manages the high-level phases of the negotiation call. Each state has defined entry/exit actions, allowed transitions, and timeout behaviors.

**Responsibilities:**
- Tracks current conversation phase (see state diagram)
- Enforces valid state transitions based on events from transcription analysis
- Triggers phase-specific behaviors (e.g., DTMF in IVR, identity info in Auth)
- Manages timeouts per state (e.g., max 10 min in HoldQueue)
- Emits state change events for logging and UI updates
- Provides context to NegotiationAgent about current phase

**Key Methods:**
- `transition(event: ConversationEvent): ConversationState` -- Processes event, returns new state
- `getCurrentState(): ConversationState` -- Returns current state
- `getStateContext(): StateContext` -- Returns phase-specific data
- `onStateChange(callback: (from: State, to: State) => void): void` -- Registers listener
- `isTerminal(): boolean` -- Returns true if in a final state

**States:**
`Idle`, `Dialing`, `Connected`, `IVRNavigation`, `HoldQueue`, `AgentGreeting`, `Authentication`, `NegotiationActive`, `OfferReceived`, `OfferAccepted`, `OfferRejected`, `Closing`, `CallEnded`, `Failed`

**Dependencies:** Event emitter, state configuration registry

---

## NegotiationAgent

The real-time Claude-powered reasoning engine that generates responses during the live call. Receives transcribed provider speech and produces appropriate responses based on the negotiation strategy and conversation state.

**Responsibilities:**
- Maintains a rolling conversation history (last N turns) for Claude context
- Generates contextually appropriate responses based on current state and strategy
- Adapts tone and approach based on provider agent's demeanor
- Identifies when the provider makes an offer (triggers RetentionOfferEvaluator)
- Detects authentication requests and provides appropriate account information
- Handles unexpected situations (transfers, disconnects, hostile agents)

**Key Methods:**
- `generateResponse(transcript: string, state: ConversationState): Promise<AgentResponse>` -- Core method
- `updateContext(turn: ConversationTurn): void` -- Adds to conversation history
- `detectOffer(transcript: string): RetentionOffer | null` -- Identifies offers in speech
- `getAuthResponse(question: string, accountInfo: AccountInfo): string` -- Handles identity verification

**AgentResponse:**
```typescript
{
  text: string;                    // what to say
  intent: ResponseIntent;         // NEGOTIATE | ACCEPT | REJECT | ESCALATE | AUTHENTICATE | HOLD
  suggestedStateTransition?: ConversationEvent;  // if state should change
  confidence: number;             // 0-1 confidence in response appropriateness
}
```

**Claude Prompt Design:**
- System prompt establishes the AI as a polite but firm customer
- Strategy parameters injected as structured context
- Conversation history maintained in messages array
- Current state and allowed actions provided as constraints
- Response must be concise (phone conversation brevity)

**Dependencies:** Claude API client, NegotiationStrategy, ConversationStateMachine

---

## RetentionOfferEvaluator

Evaluates retention offers made by the provider against the pre-planned strategy thresholds.

**Responsibilities:**
- Parses offer details from NegotiationAgent's offer detection
- Normalizes offer to comparable terms (monthly savings, percentage reduction, duration)
- Compares against strategy's target and minimum acceptable thresholds
- Decides: accept, reject, or counter-offer
- Tracks offer history within the call (multiple rounds)
- Factors in offer duration (permanent vs. promotional period)

**Key Methods:**
- `evaluate(offer: RetentionOffer, strategy: NegotiationStrategy): OfferDecision` -- Core evaluation
- `normalizeOffer(offer: RetentionOffer, currentBill: number): NormalizedOffer` -- Standardizes terms
- `shouldEscalate(roundNumber: number, strategy: NegotiationStrategy): boolean` -- Escalation check
- `generateCounterOffer(offer: RetentionOffer, strategy: NegotiationStrategy): string` -- Counter text

**OfferDecision:**
```typescript
{
  action: 'ACCEPT' | 'REJECT' | 'COUNTER' | 'ESCALATE';
  reasoning: string;
  counterOfferText?: string;
  savingsAmount?: number;
  savingsPercent?: number;
}
```

**Dependencies:** NegotiationStrategy

---

## TranscriptLogger

Persists the full conversation transcript to PostgreSQL for audit, review, and ML improvement.

**Responsibilities:**
- Buffers transcript events in memory during the call
- Writes completed transcript to PostgreSQL on call end
- Associates transcript with NegotiationSession
- Redacts PII from transcript after configurable retention period
- Supports real-time transcript streaming to the frontend via Redis pub/sub

**Key Methods:**
- `logTurn(turn: TranscriptTurn): void` -- Adds a turn to the buffer
- `persist(sessionId: string): Promise<void>` -- Writes full transcript to DB
- `streamToClient(userId: string, turn: TranscriptTurn): void` -- Publishes via Redis

**TranscriptTurn:**
```typescript
{
  speaker: 'AGENT' | 'PROVIDER' | 'SYSTEM';
  text: string;
  timestamp: number;
  state: ConversationState;
  confidence?: number;
}
```

**Dependencies:** Drizzle ORM (PostgreSQL), Redis client

---

## Interfaces

### INegotiationStrategy

```typescript
interface INegotiationStrategy {
  planStrategy(context: NegotiationContext): Promise<NegotiationStrategy>;
  validateStrategy(strategy: NegotiationStrategy): boolean;
  adjustStrategy(strategy: NegotiationStrategy, feedback: CallFeedback): NegotiationStrategy;
}
```

Abstraction for strategy generation. The default implementation uses Claude API, but this interface allows for rule-based strategies, A/B testing of different approaches, or provider-specific strategy plugins.

### IVoiceProvider

```typescript
interface IVoiceProvider {
  initiateCall(phoneNumber: string, config: CallConfig): Promise<string>;
  sendDTMF(callSid: string, digits: string): Promise<void>;
  terminateCall(callSid: string): Promise<void>;
  getMediaStreamUrl(callSid: string): string;
  onStatusChange(callSid: string, callback: (status: CallStatus) => void): void;
}
```

Abstraction for the telephony provider. Default implementation wraps Twilio. Enables testing with mock providers and potential future migration to alternative telephony platforms.

---

## Entities

### NegotiationSession

Represents a single negotiation attempt, persisted to PostgreSQL.

```typescript
{
  id: string;                          // UUID
  userId: string;                      // FK to users table
  subscriptionId: string;              // FK to subscriptions table
  providerId: string;                  // FK to providers table
  status: NegotiationStatus;           // PLANNED | IN_PROGRESS | SUCCEEDED | FAILED | CANCELLED
  strategyId: string;                  // FK to stored strategy
  callSid: string | null;             // Twilio call SID
  startedAt: Date | null;
  endedAt: Date | null;
  durationSeconds: number | null;
  originalAmount: number;              // monthly bill before negotiation
  newAmount: number | null;            // monthly bill after negotiation
  savingsAmount: number | null;        // monthly savings achieved
  savingsPercent: number | null;
  confirmationNumber: string | null;   // provider's confirmation number
  offerDetails: RetentionOffer | null; // the accepted offer, if any
  transcriptId: string | null;         // FK to transcript
  failureReason: string | null;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### RetentionOffer

Represents an offer made by the provider during negotiation.

```typescript
{
  id: string;                        // UUID
  sessionId: string;                 // FK to NegotiationSession
  offerType: OfferType;              // RATE_REDUCTION | CREDIT | PLAN_CHANGE | BUNDLE | FREE_MONTHS
  description: string;               // human-readable offer description
  newMonthlyAmount: number | null;
  creditAmount: number | null;
  duration: number | null;           // months the offer lasts (null = permanent)
  monthlySavings: number;
  annualizedSavings: number;
  isAccepted: boolean;
  evaluationReasoning: string;       // why it was accepted/rejected
  offeredAt: Date;
  roundNumber: number;               // which negotiation round (1st offer, 2nd offer, etc.)
}
```

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| Twilio call fails to connect | Retry up to 3 times with 5-minute backoff; mark FAILED after exhaustion |
| Deepgram WebSocket disconnects | Auto-reconnect within 2 seconds; buffer audio during gap |
| ElevenLabs timeout | Fall back to silence; retry synthesis on next turn |
| Claude API rate limit | Queue response; inform provider "one moment please" via pre-cached audio |
| Provider hangs up unexpectedly | Log partial outcome; retry if no offer was discussed |
| IVR navigation fails | Retry with alternative menu path; fall back to "press 0 for operator" |
| Authentication fails | Abort call gracefully; notify user to verify account details |
| Call exceeds max duration | Politely close call; log partial outcome |
