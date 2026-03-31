import { Worker, type Job } from "bullmq";
import { createRedisConnection, type NotificationJobData } from "@billkill/queue";

export function createNotificationWorker() {
  const worker = new Worker<NotificationJobData>(
    "notification",
    async (job: Job<NotificationJobData>) => {
      console.log(`[notification] Processing job ${job.id}:`, {
        userId: job.data.userId,
        type: job.data.type,
        channels: job.data.channels,
      });

      // TODO: Implement notification delivery
      // 1. Create in-app notification record
      // 2. Send email via provider
      // 3. Send push notification
      // 4. Send SMS via Twilio

      console.log(`[notification] Job ${job.id} completed (stub)`);
    },
    {
      connection: createRedisConnection(),
      concurrency: 10,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[notification] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
