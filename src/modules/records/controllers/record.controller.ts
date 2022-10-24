import {
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Worker } from "worker_threads";
import { workerThreadFilePath } from "../../../workerThreads/config";
import { RecordService } from "../services/record.service";
import { CommandBus } from "@nestjs/cqrs";
import { CommitRecordCommand } from "../commands/implementation/commit-record.command";
import { RecordsTypesEnum } from "../enums/records-types.enum";
import { AuthGuard } from "@nestjs/passport";

@Controller({ path: "/records", version: "1" })
@ApiTags("Records")
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    private readonly commandBus: CommandBus,
  ) {}

  // Uploads excel file
  @Post("upload")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
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
    await this.recordService.cacheRecords(res.data);
    return {
      message:
        "File uploaded successfully. Note that you have an hour to commit your records.",
      size: res.data.length,
    };
  }

  @Get("/cached")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  findCached(
    @Query("pageNumber") pageNumber?: number,
    @Query("pageSize") pageSize?: number,
  ) {
    return this.recordService.getCachedRecords(pageSize || 10, pageNumber || 1);
  }

  @Post("/commit")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiQuery({ required: false, name: "errorFree", example: false })
  async commitToDB(@Query("errorFree") errorFree?: boolean) {
    await this.commandBus.execute(
      new CommitRecordCommand(
        errorFree ? RecordsTypesEnum.ErrorFree : RecordsTypesEnum.All,
      ),
    );
    return { message: "Your records are being committed" };
  }
}
