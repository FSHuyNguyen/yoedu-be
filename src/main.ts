import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',

    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Chỉ cho phép các thuộc tính được định nghĩa trong DTO
      forbidNonWhitelisted: false, // Không trả lỗi nếu có thuộc tính không được định nghĩa trong DTO
      transform: true, // Tự động chuyển đổi payload thành các kiểu dữ liệu được định nghĩa trong DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
