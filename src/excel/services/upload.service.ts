import { Injectable } from "@nestjs/common";
import { read, utils } from "xlsx";

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File) {
    const workbook = read(file.buffer, { type: "buffer" });
    const data: unknown[] = [];

    const sheets = workbook.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]);
      temp.forEach((res) => {
        data.push(res);
      });
    }
    return { data };
  }
}
