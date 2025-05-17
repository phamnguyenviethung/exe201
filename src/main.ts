import { Logger as AppLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { configSwagger } from './configs/apiDocs.config';
import winstonInstance from './configs/winston.config';
async function bootstrap() {
  const logger = new AppLogger(bootstrap.name);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger({
      instance: winstonInstance,
    }),
  });

  configSwagger(app);
  const configService = app.get(ConfigService);
  app.use(morgan('dev'));

  await app.listen(configService.get('PORT'), () => {
    logger.log(
      `Server running on http://localhost:${configService.get('PORT')}`,
    );
    logger.log(
      `API Docs http://localhost:${configService.get('PORT')}/api-docs`,
    );
  });
}
bootstrap();
