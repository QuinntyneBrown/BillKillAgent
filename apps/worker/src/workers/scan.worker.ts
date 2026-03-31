import { Worker, type Job } from "bullmq";
import { createRedisConnection, type ScanJobData } from "@billkill/queue";

export function createScanWorker() {
  const worker = new Worker<ScanJobData>(
    "scan",
    async (job: Job<ScanJobData>) => {
      console.log(`[scan] Processing job ${job.id}:`, {
        userId: job.data.userId,
        plaidItemId: job.data.plaidItemId,
        fullSync: job.data.fullSync,
      });

      // TODO: Implement actual transaction scanning
      // 1. Fetch transactions from Plaid
      // 2. Detect recurring subscriptions
      // 3. Create/update subscription records
      // 4. Run waste detection analysis
      // 5. Create actions for detected waste

      console.log(`[scan] Job ${job.id} completed (stub)`);
    },
    {
      connection: createRedisConnection(),
      concurrency: 5,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[scan] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
