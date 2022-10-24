import { Injectable } from "@nestjs/common";

@Injectable()
export class CommitRecordCommand {
  constructor(public readonly errorFree: boolean) {}
}
