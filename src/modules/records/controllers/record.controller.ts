import {
  Controller,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  NotFoundException,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Worker } from "worker_threads";
import { workerThreadFilePath } from "../../../workerThreads/config";
import { RecordService } from "../services/record.service";
import { CommandBus } from "@nestjs/cqrs";
import { CommitRecordCommand } from "../commands/implementation/commit-record.command";
import { AuthGuard } from "@nestjs/passport";

@Controller({ path: "/records", version: "1" })
@ApiTags("Records")
@ApiBearerAuth()
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post("upload")
  @ApiOperation({ summary: "Uploads new excel file to be processed" })
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 200, description: "Successfully uploaded" })
  @ApiResponse({ status: 400, description: "Bad request, validations failed" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
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
            fileType: "vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Validates xlsx format
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // Initialises a worker thread that will handle the file. Worker threads will prevent blocking the main event loop
    const worker = new Worker(workerThreadFilePath, {
      workerData: file,
    });

    // Promises to return the result synchronously
    const promise = new Promise((resolve, reject) => {
      worker.on("message", (res) => {
        resolve(res);
      });
      worker.on("error", (e) => console.log("on error", reject(e)));
      worker.on("exit", (code) => console.log("on exit", code));
    });

    try {
      const res: any = await promise;

      // Save records extracted from the file into cache.
      await this.recordService.cacheRecords(res.data);

      return {
        message:
          "File uploaded successfully. Note that you have an hour to commit your records.",
        size: res.data.length,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get("/cached")
  @UseGuards(AuthGuard("jwt"))
  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiOperation({ summary: "Returns all cached records" })
  @ApiResponse({ status: 200, description: "records found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  findCached(
    @Query("pageNumber") pageNumber?: number,
    @Query("pageSize") pageSize?: number,
  ) {
    return this.recordService.getCachedRecords(pageSize || 10, pageNumber || 1);
  }

  @Post("/commit")
  @UseGuards(AuthGuard("jwt"))
  @ApiQuery({
    required: false,
    name: "errorFree",
    example: false,
    description:
      "Either saved saves all records or saves one without validation errors",
  })
  @ApiOperation({ summary: "Persist cached records to a database" })
  @ApiResponse({ status: 200, description: "Records are being committed" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "No cached records found" })
  async commitToDB(@Query("errorFree") errorFree?: boolean) {
    // Checks if there are any cached records before saving to a DB
    const exists = await this.recordService.cachedRecordsExists();

    if (!exists) throw new NotFoundException("Not cached records available");

    await this.commandBus.execute(new CommitRecordCommand(errorFree));
    return { message: "Your records are being committed" };
  }

  @Get("/")
  @UseGuards(AuthGuard("jwt"))
  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiOperation({ summary: "Returns persisted records from a database" })
  findAll(
    @Query("pageNumber") pageNumber?: number,
    @Query("pageSize") pageSize?: number,
  ) {
    return this.recordService.findAllFromDB(pageSize || 10, pageNumber || 1);
  }
}
