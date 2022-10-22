import { Module } from "@nestjs/common";

import { UploadService } from "./excel/services/upload.service";

@Module({
  imports: [],
  controllers: [],
  providers: [UploadService],
})
export class WorkerModule {}
