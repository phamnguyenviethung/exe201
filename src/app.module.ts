import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './share/filters/globalException.filter';
import { APP_FILTER } from '@nestjs/core';
import { TransformInterceptor } from './share/interceptors/apiResponse.interceptor';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import dbConfig from './mikro-orm.config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import * as path from 'path';
import { QueryResolver, I18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { ClerkClientProvider } from './share/providers/clerk.provider';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from '@/modules/customer/customer.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.valid('development', 'production').default('development'),
        PORT: Joi.number().default(5678),
        CLERK_SECRET_KEY: Joi.string().required(),
        CLERK_PUBLISHABLE_KEY: Joi.string().required(),
        CLERK_JWT_KEY: Joi.string().required(),
        CLERK_WEBHOOK_SIGNING_SECRET: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      cache: true,
      expandVariables: true,
    }),
    MikroOrmModule.forRoot(dbConfig),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts',
      ),
    }),
    AuthModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClerkClientProvider,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
