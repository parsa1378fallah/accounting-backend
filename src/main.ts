import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ==============================
  // Global Prefix
  // ==============================
  app.setGlobalPrefix('api');

  // ==============================
  // Global Pipes (Validation)
  // ==============================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown fields
      transform: true, // auto transform DTO types
      forbidNonWhitelisted: true, // throw error for unknown fields
    }),
  );

  // ==============================
  // Swagger Config
  // ==============================
  const config = new DocumentBuilder()
    .setTitle('ERP System API')
    .setDescription('Enterprise Accounting & ERP System')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // JWT در Swagger ذخیره می‌شود
    },
  });

  // ==============================
  // Start Server
  // ==============================
  const port = process.env.PORT ?? 5000;

  await app.listen(port);

  console.log(`🚀 Server running on: http://localhost:${port}/api`);
  console.log(`📘 Swagger: http://localhost:${port}/docs`);
}

bootstrap();