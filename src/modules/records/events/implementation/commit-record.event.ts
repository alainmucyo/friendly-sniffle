import { Injectable } from "@nestjs/common";
import { RecordsTypesEnum } from "../../enums/records-types.enum";

@Injectable()
export class CommitRecordEvent {
  constructor(public readonly type: RecordsTypesEnum) {}
}
