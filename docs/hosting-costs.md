# BillKillAgent — Hosting Cost Analysis

## Overview

This document provides infrastructure cost estimates for Development, Staging, and Production environments across all required services.

---

## Development Environment

Optimized for individual developer use with free tiers and minimal resources.

| Service | Product | Tier | Monthly Cost |
|---------|---------|------|-------------|
| **Frontend Hosting** | Vercel | Hobby (free) | $0 |
| **Backend Hosting** | Railway | Starter (free $5 credit) | $5 |
| **Database** | Railway PostgreSQL | Starter | Included |
| **Cache** | Upstash Redis | Free (10K cmds/day) | $0 |
| **Auth** | Supabase Auth | Free (50K MAU) | $0 |
| **Bank Integration** | Plaid | Sandbox (unlimited) | $0 |
| **AI** | Claude API | Pay-per-token (dev testing) | ~$10-20 |
| **Voice - Telephony** | Twilio | Pay-as-you-go (test calls) | ~$5 |
| **Voice - STT** | Deepgram | Free tier (12hrs/mo) | $0 |
| **Voice - TTS** | ElevenLabs | Free tier (10K chars/mo) | $0 |
| **Email** | Resend | Free (100 emails/day) | $0 |
| **Payments** | Stripe | Test mode (free) | $0 |
| **Error Tracking** | Sentry | Developer (free) | $0 |
| **CI/CD** | GitHub Actions | Free (2,000 min/mo) | $0 |
| | | | |
| **Dev Total** | | | **$20-30/mo** |

### Notes
- Plaid Sandbox provides unlimited test data with no real bank connections
- Claude API costs depend on usage; expect ~$0.01-0.05 per test negotiation
- Twilio test calls cost ~$0.02/min
- All free tiers are sufficient for single-developer workflows

---

## Staging Environment

Mirrors production architecture with reduced capacity. Used for QA, integration testing, and demos.

| Service | Product | Tier | Monthly Cost |
|---------|---------|------|-------------|
| **Frontend Hosting** | Vercel | Pro (1 seat) | $20 |
| **Backend Hosting** | Railway | Pro (2 services) | $20 |
| **Database** | Railway PostgreSQL | Pro (1GB RAM, 10GB storage) | $15 |
| **Cache** | Upstash Redis | Pay-as-you-go | $10 |
| **Auth** | Supabase | Free tier | $0 |
| **Bank Integration** | Plaid | Development (100 items free) | $0 |
| **AI** | Claude API | Moderate testing | ~$30-50 |
| **Voice - Telephony** | Twilio | Pay-as-you-go | ~$20-30 |
| **Voice - STT** | Deepgram | Pay-as-you-go (~5hrs) | ~$10-15 |
| **Voice - TTS** | ElevenLabs | Starter | $5-22 |
| **Email** | Resend | Free/Pro | $0-20 |
| **Payments** | Stripe | Test mode | $0 |
| **Error Tracking** | Sentry | Team | $26 |
| **Monitoring** | Axiom | Free (500MB/mo) | $0 |
| **CI/CD** | GitHub Actions | Free | $0 |
| | | | |
| **Staging Total** | | | **$156-228/mo** |

### Notes
- Plaid Development tier allows 100 Items for free (sufficient for staging)
- Voice costs scale with number of test negotiation calls
- ElevenLabs Starter provides 30K characters/month

---

## Production Environment

### Tier 1: Launch (0-1,000 users)

| Service | Product | Tier | Monthly Cost |
|---------|---------|------|-------------|
| **Frontend Hosting** | Vercel | Pro (team, 3 seats) | $60 |
| **Backend Hosting** | Railway | Pro (2 services, 2GB RAM each) | $40 |
| **Database** | Railway PostgreSQL | Pro (4GB RAM, 50GB storage) | $30 |
| **Cache** | Upstash Redis | Pro (10K cmds/sec) | $20 |
| **Auth** | Supabase | Pro | $25 |
| **Bank Integration** | Plaid | Production ($0.30/item/mo) | $150-300 |
| **AI** | Claude API | Production (Haiku for triage, Sonnet for negotiation) | $200-500 |
| **Voice - Telephony** | Twilio | Pay-as-you-go ($0.014/min outbound) | $100-300 |
| **Voice - STT** | Deepgram | Growth ($0.0043/min) | $50-150 |
| **Voice - TTS** | ElevenLabs | Scale ($0.18/1K chars) | $50-150 |
| **Email** | Resend | Pro (50K emails/mo) | $20 |
| **SMS** | Twilio SMS | $0.0079/msg | $10-30 |
| **Payments** | Stripe | 2.9% + $0.30/txn | Variable |
| **Error Tracking** | Sentry | Team | $26 |
| **Monitoring** | Datadog | Pro (5 hosts) | $75 |
| **Compliance** | Vanta | Startup (SOC 2) | $300 |
| **CDN/Storage** | AWS S3 + CloudFront | (call recordings) | $10-30 |
| | | | |
| **Tier 1 Total** | | | **$1,166-2,081/mo** |

### Tier 2: Growth (1,000-10,000 users)

| Service | Product | Tier | Monthly Cost |
|---------|---------|------|-------------|
| **Frontend Hosting** | Vercel | Pro (team) | $60 |
| **Backend Hosting** | AWS ECS Fargate | 2 tasks (2 vCPU, 4GB each) | $120 |
| **Database** | AWS RDS PostgreSQL | db.r6g.large (16GB RAM, 200GB) | $200 |
| **Cache** | AWS ElastiCache Redis | cache.r6g.large | $120 |
| **Auth** | Supabase | Pro | $25 |
| **Bank Integration** | Plaid | Production (volume discount) | $1,500-3,000 |
| **AI** | Claude API | High volume | $1,000-2,500 |
| **Voice - Telephony** | Twilio | Volume pricing | $500-1,500 |
| **Voice - STT** | Deepgram | Growth | $200-500 |
| **Voice - TTS** | ElevenLabs | Scale | $200-500 |
| **Email** | Resend | Business (100K emails/mo) | $40 |
| **SMS** | Twilio SMS | | $50-100 |
| **Payments** | Stripe | 2.9% + $0.30 | Variable |
| **Error Tracking** | Sentry | Business | $80 |
| **Monitoring** | Datadog | Pro (10 hosts) | $150 |
| **Compliance** | Vanta | Startup | $300 |
| **CDN/Storage** | AWS S3 + CloudFront | | $50-100 |
| | | | |
| **Tier 2 Total** | | | **$4,595-9,270/mo** |

### Tier 3: Scale (10,000-100,000 users)

| Service | Product | Tier | Monthly Cost |
|---------|---------|------|-------------|
| **Frontend Hosting** | Vercel | Enterprise | $500 |
| **Backend Hosting** | AWS ECS Fargate | 8 tasks auto-scaling | $500 |
| **Database** | AWS RDS PostgreSQL | db.r6g.2xlarge + read replica | $1,200 |
| **Cache** | AWS ElastiCache Redis | Cluster (3 nodes) | $500 |
| **Auth** | Supabase | Pro (or Auth0 Enterprise) | $100 |
| **Bank Integration** | Plaid | Enterprise pricing | $15,000-30,000 |
| **AI** | Claude API | Enterprise | $10,000-25,000 |
| **Voice - Telephony** | Twilio | Enterprise | $5,000-15,000 |
| **Voice - STT** | Deepgram | Enterprise | $2,000-5,000 |
| **Voice - TTS** | ElevenLabs | Enterprise | $2,000-5,000 |
| **Email** | Resend/SES | High volume | $200 |
| **SMS** | Twilio SMS | | $500-1,000 |
| **Payments** | Stripe | Volume discount | Variable |
| **Error Tracking** | Sentry | Business | $160 |
| **Monitoring** | Datadog | Enterprise | $500 |
| **Compliance** | Vanta | Growth | $500 |
| **CDN/Storage** | AWS S3 + CloudFront | | $200-500 |
| **WAF/Security** | AWS WAF + Shield | | $100 |
| | | | |
| **Tier 3 Total** | | | **$38,960-85,760/mo** |

---

## Cost Summary Table

| Environment | Users | Monthly Cost | Per-User Cost |
|-------------|-------|-------------|---------------|
| **Development** | 1 (developer) | $20-30 | N/A |
| **Staging** | ~50 (test) | $156-228 | N/A |
| **Prod Tier 1** | 0-1K | $1,166-2,081 | $1.17-2.08 |
| **Prod Tier 2** | 1K-10K | $4,595-9,270 | $0.46-0.93 |
| **Prod Tier 3** | 10K-100K | $38,960-85,760 | $0.39-0.86 |

---

## Unit Economics at Scale

| Metric | Value |
|--------|-------|
| Average savings per user | $80/mo |
| Take rate (performance fee) | 25% |
| Revenue per user | $20/mo |
| Infrastructure cost per user (at 10K) | ~$0.70/mo |
| **Gross margin** | **~96.5%** |

---

## Primary Cost Drivers

| Component | % of Total (at scale) | Optimization Strategy |
|-----------|----------------------|----------------------|
| **Plaid** | 35-45% | Negotiate enterprise pricing at 5K+ items; consider MX Technologies or Finicity as alternatives |
| **AI (Claude API)** | 20-30% | Use Haiku for classification/triage, Sonnet only for active negotiation; cache provider scripts |
| **Voice (Twilio + STT + TTS)** | 15-25% | Batch calls during off-peak hours; cache common TTS phrases; optimize call duration |
| **Infrastructure** | 5-10% | Auto-scaling, reserved instances, spot instances for workers |
| **Compliance** | 1-3% | Fixed cost, amortized over user base |

---

## Cost Reduction Roadmap

### Phase 1 (Launch)
- Use free tiers wherever possible
- Plaid Sandbox for development
- Single Railway instance for API + Worker

### Phase 2 (Growth)
- Negotiate Plaid volume discounts
- Implement Claude prompt caching to reduce token costs
- Cache ElevenLabs TTS for common negotiation phrases
- Move to AWS for better price/performance at scale

### Phase 3 (Scale)
- Enterprise contracts with all major vendors (Plaid, Twilio, Anthropic)
- Self-hosted STT model (Whisper) to reduce Deepgram costs
- Multi-region deployment for latency optimization
- Reserved instances for predictable workloads

---

## Environment Parity Notes

| Concern | Dev | Staging | Prod |
|---------|-----|---------|------|
| **Database** | Railway PG | Railway PG | AWS RDS |
| **Redis** | Upstash | Upstash | ElastiCache |
| **Plaid** | Sandbox | Development | Production |
| **Twilio** | Test credentials | Test credentials | Live credentials |
| **Stripe** | Test mode | Test mode | Live mode |
| **SSL/TLS** | Auto (Vercel) | Auto (Vercel) | Auto (Vercel + AWS ACM) |
| **Monitoring** | Console logs | Sentry + Axiom | Datadog + Sentry |
| **Backups** | None | Daily | Continuous + PITR |
