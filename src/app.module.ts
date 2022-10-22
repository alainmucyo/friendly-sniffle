import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RedisHelper } from "./helpers/redis-helper";
import { ExcelModule } from "./excel/excel.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot(), ExcelModule],
  controllers: [AppController],
  providers: [AppService, RedisHelper],
})
export class AppModule {}
