import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { getAppConfig } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const appConfig = getAppConfig();

  await app.listen(appConfig.port);
}

void bootstrap();
