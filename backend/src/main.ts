import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 NestJS Enterprise API Backend is running live on http://localhost:${port}`);
}
bootstrap();
