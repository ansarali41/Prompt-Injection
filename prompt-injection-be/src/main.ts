import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Prompt Injection API')
    .setDescription('Prompt Injection  API description')
    .setVersion('1.0')
    .addTag('Prompt Injection')
    .build();

  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    credentials: true,
  });

  app.use(morgan('dev'));

  const PORT = 5000;
  await app.listen(PORT, () => {
    console.log(
      `Server is running on ${PORT}. API-DOCS: http://localhost:${PORT}/api-docs`,
    );
  });
}
bootstrap();
