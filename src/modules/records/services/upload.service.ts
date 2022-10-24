import { Injectable } from "@nestjs/common";
import { read, utils } from "xlsx";
import { RecordDto } from "../dtos/record.dto";
import { validateSync } from "class-validator";

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File) {
    const workbook = read(file.buffer, { type: "buffer" });
    const data: RecordDto[] = [];

    const sheets = workbook.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]);
      temp.forEach((res: any) => {
        res.errors = [];
        const record = new RecordDto();
        record.names = res.names;
        record.email = res.email;
        record.phoneNumber = res.phoneNumber;
        record.nid = res.nid;
        record.gender = res.gender.toLowerCase();
        record.errors = [];
        const errors = validateSync(record);
        if (errors.length > 0) {
          record.errors = errors.map((e) => Object.values(e.constraints)[0]);
        }
        data.push(record);
      });
    }
    return { data };
  }
}
