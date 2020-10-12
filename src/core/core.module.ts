import { CacheModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as appRoot from 'app-root-path';
import { Response } from 'express';
import { RouterModule } from 'nest-router';
import { AutomapperModule } from 'nestjsx-automapper';
import { join } from 'path';
import { routes } from 'src/common/constants/routes.constant';
import { Environment } from 'src/common/enums/environment.enum';
import { Path } from 'src/common/enums/path.enum';
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
      // useUndefined: true,
      // destinationNamingConvention: SnakeCaseNamingConvention,
      throwError: process.env.NODE_ENV === Environment.PRODUCTION,
    }),
    CacheModule.registerAsync({
      imports: [CacheConfigModule],
      useExisting: CacheConfigService,
    }),
    DatabaseModule,
    HealthModule,
    LoggerModule,
    RouterModule.forRoutes(routes), // Setup routes
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(appRoot.path, 'public'),
      exclude: [Path.API],
      serveStaticOptions: {
        setHeaders: (res: Response, path: string) => {
          if (path.endsWith('ngsw-worker.js')) {
            res.setHeader(
              'Content-Security-Policy',
              "connect-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com https://www.googleapis.com",
            );
          }
        },
      },
    }),
  ],
  exports: [CacheModule],
})
export class CoreModule {}
