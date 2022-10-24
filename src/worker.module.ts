import { Module } from "@nestjs/common";

import { UploadService } from "./modules/records/services/upload.service";

@Module({
  imports: [],
  controllers: [],
  providers: [UploadService],
})
export class WorkerModule {}
