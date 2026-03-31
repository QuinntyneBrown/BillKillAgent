import { Worker, type Job } from "bullmq";
import { createRedisConnection, type NegotiationJobData } from "@billkill/queue";

export function createNegotiationWorker() {
  const worker = new Worker<NegotiationJobData>(
    "negotiation",
    async (job: Job<NegotiationJobData>) => {
      console.log(`[negotiation] Processing job ${job.id}:`, {
        actionId: job.data.actionId,
        provider: job.data.providerName,
        currentRate: job.data.currentRate,
        targetRate: job.data.targetRate,
      });

      // TODO: Implement actual negotiation logic
      // 1. Look up provider flow and script
      // 2. Initiate call via Twilio or chat
      // 3. Use Claude AI to negotiate
      // 4. Track retention offers
      // 5. Update action and create negotiation session
      // 6. Create savings record if successful

      console.log(`[negotiation] Job ${job.id} completed (stub)`);
    },
    {
      connection: createRedisConnection(),
      concurrency: 2,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[negotiation] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
