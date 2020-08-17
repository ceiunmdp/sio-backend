import { CacheModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RouterModule } from 'nest-router';
import { AutomapperModule } from 'nestjsx-automapper';
import { join } from 'path';
import { routes } from 'src/common/constants/routes.constant';
import { ApiConfigModule } from 'src/config/api/api-config.module';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { CacheConfigModule } from 'src/config/cache/cache-config.module';
import { CacheConfigService } from 'src/config/cache/cache-config.service';
import { DatabaseModule } from 'src/database/database.module';
import { HealthModule } from 'src/health/health.module';
import { LoggerModule } from 'src/logger/logger.module';
//! Profiles
import '../common/base-classes/base-entity.profile';

@Module({
  imports: [
    AppConfigModule,
    ApiConfigModule,
    AutomapperModule.withMapper({
      // destinationNamingConvention: SnakeCaseNamingConvention,
    }),
    CacheModule.registerAsync({
      imports: [CacheConfigModule],
      useExisting: CacheConfigService,
    }),
    DatabaseModule,
    HealthModule,
    LoggerModule,
    RouterModule.forRoutes(routes), // Setup routes
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
  ],
  exports: [CacheModule],
})
export class CoreModule {}
