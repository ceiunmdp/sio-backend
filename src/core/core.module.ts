import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { RouterModule } from 'nest-router';
import { routes } from 'src/common/constants/routes.constant';
import { AllExceptionsFilter } from 'src/common/filters/http-exception.filter';
import { ErrorsInterceptor } from 'src/common/interceptors/errors.interceptor';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { SerializerInterceptor } from 'src/common/interceptors/serializer.interceptor';
import { TimeoutInterceptor } from 'src/common/interceptors/timeout.interceptor';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { DatabaseModule } from 'src/database/database.module';
import { HealthModule } from 'src/health/health.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<string>('CACHE_TTL'),
        max: configService.get<string>('CACHE_MAX'),
        // store: configService.get<string>('CACHE_STORE'),
      }),
    }),
    DatabaseModule,
    HealthModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('MULTER_DEST'),
      }),
    }),
    RouterModule.forRoutes(routes), // Setup routes
  ],
  providers: [
    // Enable LoggingInterceptor globally
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

    // Enable TransformInterceptor globally
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    // Enable ErrorsInterceptor globally
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },

    // Enable CacheInterceptor globally
    // Bind CacheInterceptor to all endpoints globally
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },

    // Enable AllExceptionsFilter globally
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    // Enable TimeoutInterceptor globally
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },

    // Enable ValidationPipe globally (every DTO is automatically validated)
    // {
    //     provide: APP_PIPE,
    //     useClass: ValidationPipe, // Use app.useGlobalPipes() in case of custom configuration needed
    // },

    // Set up global interceptor to serialize responses
    {
      provide: APP_INTERCEPTOR,
      // useClass: ClassSerializerInterceptor,
      useClass: SerializerInterceptor,
    },
  ],
})
export class CoreModule {}
