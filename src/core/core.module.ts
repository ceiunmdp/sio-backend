import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from 'nest-router';
import { routes } from 'src/common/constants/routes.constant';
import { ApiConfigModule } from 'src/config/api/api-config.module';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { DatabaseModule } from 'src/database/database.module';
import { HealthModule } from 'src/health/health.module';
import { LoggerModule } from 'src/logger/logger.module';
import { AutomapperModule } from 'nestjsx-automapper';

@Module({
  imports: [
    AppConfigModule,
    ApiConfigModule,
    AutomapperModule.withMapper(),
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
    LoggerModule,
    RouterModule.forRoutes(routes), // Setup routes
  ],
})
export class CoreModule {}
