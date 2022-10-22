import { Module } from "@nestjs/common";
import { UploadService } from "./services/upload.service";
import { CqrsModule } from "@nestjs/cqrs";
import { ExcelController } from "./services/excel.controller";

@Module({
  imports: [CqrsModule],
  controllers: [ExcelController],
  providers: [UploadService],
})
export class ExcelModule {}
