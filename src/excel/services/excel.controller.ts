import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { Worker } from "worker_threads";
import { workerThreadFilePath } from "../../workerThreads/config";

@Controller({ path: "/excel", version: "1" })
export class ExcelController {
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const worker = new Worker(workerThreadFilePath, {
      workerData: file,
    });
    const promise = new Promise((resolve, reject) => {
      worker.on("message", (res) => {
        resolve(res);
      });
      worker.on("error", (e) => console.log("on error", reject(e)));
      worker.on("exit", (code) => console.log("on exit", code));
    });
    const res: any = await promise;
    return { size: res.data.length };
  }
}
