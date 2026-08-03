import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global bulletproof CORS middleware
  app.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,X-Requested-With',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 NestJS Enterprise API Backend is running live on http://localhost:${port}`);
}
bootstrap();
