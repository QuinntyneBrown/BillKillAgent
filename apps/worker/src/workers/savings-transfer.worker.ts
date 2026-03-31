import { Worker, type Job } from "bullmq";
import { createRedisConnection, type SavingsTransferJobData } from "@billkill/queue";

export function createSavingsTransferWorker() {
  const worker = new Worker<SavingsTransferJobData>(
    "savings-transfer",
    async (job: Job<SavingsTransferJobData>) => {
      console.log(`[savings-transfer] Processing job ${job.id}:`, {
        userId: job.data.userId,
        destinationId: job.data.destinationId,
        amount: job.data.amount,
      });

      // TODO: Implement savings transfer
      // 1. Validate destination account
      // 2. Initiate transfer via banking API
      // 3. Update transfer record status
      // 4. Send confirmation notification

      console.log(`[savings-transfer] Job ${job.id} completed (stub)`);
    },
    {
      connection: createRedisConnection(),
      concurrency: 3,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[savings-transfer] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
