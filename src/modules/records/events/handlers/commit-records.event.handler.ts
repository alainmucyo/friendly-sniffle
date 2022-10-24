import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CommitRecordEvent } from "../implementation/commit-record.event";
import { RecordService } from "../../services/record.service";

@EventsHandler(CommitRecordEvent)
export class CommitRecordsEventHandler
  implements IEventHandler<CommitRecordEvent>
{
  constructor(private readonly record: RecordService) {}
  async handle(event: CommitRecordEvent) {
    await this.record.saveCachedRecordsToDB(event.errorFree);
  }
}
