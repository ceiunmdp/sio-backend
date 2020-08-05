import { SnakeCaseNamingConvention } from '@nartc/automapper';
import { CacheModule, Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { AutomapperModule } from 'nestjsx-automapper';
import { routes } from 'src/common/constants/routes.constant';
import { ApiConfigModule } from 'src/config/api/api-config.module';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { CacheConfigModule } from 'src/config/cache/cache-config.module';
import { CacheConfigService } from 'src/config/cache/cache-config.service';
import { DatabaseModule } from 'src/database/database.module';
import { HealthModule } from 'src/health/health.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    AppConfigModule,
    ApiConfigModule,
    AutomapperModule.withMapper({
      destinationNamingConvention: SnakeCaseNamingConvention,
    }),
    CacheModule.registerAsync({
      imports: [CacheConfigModule],
      useExisting: CacheConfigService,
    }),
    DatabaseModule,
    HealthModule,
    LoggerModule,
    RouterModule.forRoutes(routes), // Setup routes
  ],
  exports: [CacheModule],
})
export class CoreModule {}
