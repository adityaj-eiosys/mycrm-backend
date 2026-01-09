import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedAdmin } from './users/seed-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
  
  // Seed default admin after the app is fully initialized
  try {
    const dataSource = app.get(DataSource);
    await seedAdmin(dataSource);
  } catch (err) {
    console.error('❌ Failed to seed admin:', err?.message || err);
    if (process.env.NODE_ENV === 'development') {
      console.error(err);
    }
  }
}
bootstrap();
