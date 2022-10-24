import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CommitRecordCommand } from "../implementation/commit-record.command";
import { CommitRecordEvent } from "../../events/implementation/commit-record.event";

@CommandHandler(CommitRecordCommand)
export class CommitRecordHandler
  implements ICommandHandler<CommitRecordCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: CommitRecordCommand): Promise<any> {
    await this.eventBus.publish(new CommitRecordEvent(command.errorFree));
  }
}
