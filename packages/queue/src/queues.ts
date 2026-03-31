import { Queue } from "bullmq";
import { connection } from "./connection.js";
import type {
  CancellationJobData,
  NegotiationJobData,
  ScanJobData,
  MonitoringJobData,
  NotificationJobData,
  SavingsTransferJobData,
} from "./jobs/index.js";

export const cancellationQueue = new Queue<CancellationJobData>("cancellation", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
});

export const negotiationQueue = new Queue<NegotiationJobData>("negotiation", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 10000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
});

export const scanQueue = new Queue<ScanJobData>("scan", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 500 },
    removeOnFail: { count: 1000 },
  },
});

export const monitoringQueue = new Queue<MonitoringJobData>("monitoring", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 500 },
    removeOnFail: { count: 1000 },
  },
});

export const notificationQueue = new Queue<NotificationJobData>("notification", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { count: 2000 },
    removeOnFail: { count: 5000 },
  },
});

export const savingsTransferQueue = new Queue<SavingsTransferJobData>("savings-transfer", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 2000 },
  },
});
