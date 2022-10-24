import { Module } from "@nestjs/common";
import { UploadService } from "./services/upload.service";
import { CqrsModule } from "@nestjs/cqrs";
import { RecordController } from "./controllers/record.controller";
import { RecordService } from "./services/record.service";
import { RedisHelper } from "../../helpers/redis-helper";
import { CommitRecordHandler } from "./commands/handlers/commit-record.handler";
import { CommitRecordsEventHandler } from "./events/handlers/commit-records.event.handler";

@Module({
  imports: [CqrsModule],
  controllers: [RecordController],
  providers: [
    UploadService,
    RecordService,
    RedisHelper,
    CommitRecordHandler,
    CommitRecordsEventHandler,
  ],
})
export class RecordModule {}
