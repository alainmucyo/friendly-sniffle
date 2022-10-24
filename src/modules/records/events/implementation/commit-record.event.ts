import { Injectable } from "@nestjs/common";

@Injectable()
export class CommitRecordEvent {
  constructor(public readonly errorFree: boolean) {}
}
