import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Chỉ cho phép các thuộc tính được định nghĩa trong DTO
      forbidNonWhitelisted: false, // Không trả lỗi nếu có thuộc tính không được định nghĩa trong DTO
      transform: true, // Tự động chuyển đổi payload thành các kiểu dữ liệu được định nghĩa trong DTO
    }),
  );

  /* Config swagger api */
  const config = new DocumentBuilder()
    .setTitle('Yoedu API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
