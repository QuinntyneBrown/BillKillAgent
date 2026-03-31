import { createCancellationWorker } from "./workers/cancellation.worker.js";
import { createNegotiationWorker } from "./workers/negotiation.worker.js";
import { createScanWorker } from "./workers/scan.worker.js";
import { createMonitoringWorker } from "./workers/monitoring.worker.js";
import { createNotificationWorker } from "./workers/notification.worker.js";
import { createSavingsTransferWorker } from "./workers/savings-transfer.worker.js";

console.log("Starting BillKill workers...");

const workers = [
  createCancellationWorker(),
  createNegotiationWorker(),
  createScanWorker(),
  createMonitoringWorker(),
  createNotificationWorker(),
  createSavingsTransferWorker(),
];

console.log(`Started ${workers.length} workers:`);
console.log("  - cancellation");
console.log("  - negotiation");
console.log("  - scan");
console.log("  - monitoring");
console.log("  - notification");
console.log("  - savings-transfer");

async function shutdown() {
  console.log("Shutting down workers...");
  await Promise.all(workers.map((w) => w.close()));
  console.log("All workers shut down.");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
