import { Worker, type Job } from "bullmq";
import { createRedisConnection, type MonitoringJobData } from "@billkill/queue";

export function createMonitoringWorker() {
  const worker = new Worker<MonitoringJobData>(
    "monitoring",
    async (job: Job<MonitoringJobData>) => {
      console.log(`[monitoring] Processing job ${job.id}:`, {
        userId: job.data.userId,
        subscriptionId: job.data.subscriptionId,
        checkType: job.data.checkType,
      });

      // TODO: Implement monitoring checks
      // 1. Check for price changes
      // 2. Analyze usage patterns
      // 3. Detect waste/unused subscriptions
      // 4. Verify subscription status

      console.log(`[monitoring] Job ${job.id} completed (stub)`);
    },
    {
      connection: createRedisConnection(),
      concurrency: 5,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[monitoring] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
