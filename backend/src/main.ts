import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import { createWinstonLoggerOptions, getAppConfig } from './config';

async function bootstrap(): Promise<void> {
  const logger = WinstonModule.createLogger(createWinstonLoggerOptions());
  const app = await NestFactory.create(AppModule, { logger });
  const appConfig = getAppConfig();

  await app.listen(appConfig.port);
}

void bootstrap();
