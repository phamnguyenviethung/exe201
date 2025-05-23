import { CustomerModule } from '@/modules/customer/customer.module';
import { PaymentModule } from '@/modules/payment/payment.module';
import { ExpressAdapter } from '@bull-board/express';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import * as Joi from 'joi';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalExceptionFilter } from './share/filters/globalException.filter';
import { TransformInterceptor } from './share/interceptors/apiResponse.interceptor';
import { ClerkClientProvider } from './share/providers/clerk.provider';

import { BullBoardModule } from '@bull-board/nestjs';
import { MikroORM } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { BullModule } from '@nestjs/bullmq';
import { BookingModule } from './modules/booking/booking.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AppZodValidationPipe } from './share/pipes/zodError.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.valid('development', 'production').default('development'),
        PORT: Joi.number().default(5678),
        CLERK_SECRET_KEY: Joi.string().required(),
        CLERK_PUBLISHABLE_KEY: Joi.string().required(),
        CLERK_JWT_KEY: Joi.string().required(),
        CLERK_CUSTOM_JWT_SECRET: Joi.string().required(),
        CLERK_WEBHOOK_SIGNING_SECRET: Joi.string().required(),
        ZALOPAY_APP_ID: Joi.string().required(),
        ZALOPAY_KEY1: Joi.string().required(),
        ZALOPAY_KEY2: Joi.string().required(),
        PAYOS_API_KEY: Joi.string().required(),
        PAYOS_CLIENT_ID: Joi.string().required(),
        PAYOS_CHECKSUM: Joi.string().required(),
        NGROK_URL: Joi.string(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_USERNAME: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      cache: true,
      expandVariables: true,
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST');
        return {
          connection: {
            family: 0,
            host: host,
            port: configService.get<number>('REDIS_PORT'),
            password: configService.get<string>('REDIS_PASSWORD') || undefined,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return defineConfig({
          highlighter: new SqlHighlighter(),
          debug: configService.get<string>('NODE_ENV') === 'development',
          dbName: configService.get<string>('DB_NAME'),
          user: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          entities: ['./dist/database/entities/*.entity.js'],
          entitiesTs: ['./src/database/entities/*.entity.ts'],
          extensions: [Migrator, SeedManager],
          migrations: {
            path: 'dist/migrations',
            pathTs: 'src/migrations',
          },
          seeder: {
            path: './dist/database/seeders',
            pathTs: './src/database/seeders',
            defaultSeeder: 'DatabaseSeeder',
            glob: '!(*.d).{js,ts}',
            fileName: (className: string) => className,
          },
        });
      },
      inject: [ConfigService],
    }),
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
    PaymentModule,
    TransactionModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClerkClientProvider,
    {
      provide: APP_PIPE,
      useClass: AppZodValidationPipe,
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
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }
}
