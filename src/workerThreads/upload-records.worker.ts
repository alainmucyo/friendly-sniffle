import { NestFactory } from "@nestjs/core";
import { workerData, parentPort } from "worker_threads";
import { UploadService } from "../modules/records/services/upload.service";
import { WorkerModule } from "../worker.module";

async function run() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  const uploadService = app.get(UploadService);

  const file: Express.Multer.File = workerData;
  const res = uploadService.uploadFile(file);
  // Sends a message once the file is uploaded and processed
  parentPort.postMessage(res);
}

run();
