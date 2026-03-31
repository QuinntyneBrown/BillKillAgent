import { Worker, type Job } from "bullmq";
import { createRedisConnection, type CancellationJobData } from "@billkill/queue";

export function createCancellationWorker() {
  const worker = new Worker<CancellationJobData>(
    "cancellation",
    async (job: Job<CancellationJobData>) => {
      console.log(`[cancellation] Processing job ${job.id}:`, {
        actionId: job.data.actionId,
        provider: job.data.providerName,
        method: job.data.method,
      });

      // TODO: Implement actual cancellation logic
      // 1. Look up provider flow
      // 2. Execute cancellation method (API/phone/email/chat/portal)
      // 3. Update action status
      // 4. Create savings record if successful
      // 5. Send notification

      console.log(`[cancellation] Job ${job.id} completed (stub)`);
    },
    {
      connection: createRedisConnection(),
      concurrency: 3,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[cancellation] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
