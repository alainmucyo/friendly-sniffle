import { Injectable } from "@nestjs/common";
import { RecordsTypesEnum } from "../../enums/records-types.enum";

@Injectable()
export class CommitRecordCommand {
  constructor(public readonly type: RecordsTypesEnum) {}
}
