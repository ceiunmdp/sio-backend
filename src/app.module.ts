import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { RouterModule } from 'nest-router';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { FacultyEntitiesModule } from './faculty-entities/faculty-entities.module';
import { HealthModule } from './health/health.module';
import { AllExceptionsFilter } from './helpers/http-exception.filter';
import { routes } from './routes';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<string>('CACHE_TTL'),
      }),
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('MULTER_DEST'),
      }),
    }),

    RouterModule.forRoutes(routes), // Setup the routes

    AuthModule,
    DatabaseModule,
    FacultyEntitiesModule,
    HealthModule,
    UsersModule,
  ],
  providers: [
    // Enable CacheInterceptor globally
    // Bind CacheInterceptor to all endpoints globally
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },

    // Enable AllExceptionsFilter globally
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    // Enable ValidationPipe globally (every DTO is automatically validated)
    // {
    //     provide: APP_PIPE,
    //     useClass: ValidationPipe, // Use app.useGlobalPipes() in case of custom configuration needed
    // },

    // Set up global interceptor to serialize responses
    // {
    //     provide: APP_INTERCEPTOR,
    //     // useClass: ClassSerializerInterceptor,
    //     useClass: SerializerInterceptor,
    // },
  ],
})
export class AppModule {}
