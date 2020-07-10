import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AllExceptionsFilter } from './helpers/http-exception.filter';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        AuthModule,
        CacheModule.registerAsync({
            // imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                ttl: configService.get<string>('CACHE_TTL'),
            }),
        }),
        ConfigurationModule,
        DatabaseModule,
        HealthModule,
        MulterModule.registerAsync({
            // imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                dest: configService.get<string>('MULTER_DEST'),
            }),
        }),
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
