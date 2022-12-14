import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allows validations
  app.useGlobalPipes(new ValidationPipe());

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "api/v",
  });

  const config = new DocumentBuilder()
    .setTitle("RSSB Coding test")
    .setDescription("Coding test API")
    .setVersion("1.0")
    .addTag("RSSB")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api-docs", app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
