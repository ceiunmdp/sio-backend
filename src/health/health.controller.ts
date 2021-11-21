import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import * as bytes from 'bytes';
import checkDiskSpace from 'check-disk-space';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { MulterConfigService } from 'src/config/multer/multer-config.service';

@ApiTags(Collection.HEALTH)
@Controller()
export class HealthController {
  private readonly filesDirectoryBasePath: string;

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private typeOrm: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    multerConfigService: MulterConfigService,
  ) {
    this.filesDirectoryBasePath = multerConfigService.basePath;
  }

  @Get()
  @HealthCheck()
  healthcheck() {
    return this.health.check([
      // DNS Healthcheck
      () => this.http.pingCheck('google', 'https://www.google.com', { timeout: 300 }),

      // Database Healthcheck
      () => this.typeOrm.pingCheck('database', { timeout: 300 }),

      // The process should not use more than 500MB memory
      () => this.memory.checkHeap('memory_heap', bytes('500MB')),

      // The process should not have more than 300MB allocated
      () => this.memory.checkRSS('memory_rss', bytes('300MB')),

      // The used disk storage should not exceed 50% of the full disk size
      () => this.disk.checkStorage('storage', { thresholdPercent: 0.8, path: this.getPathToFilesDirectory() }),
    ]);
  }

  @Get(Path.STORAGE)
  @Auth(UserRole.ADMIN)
  getDiskSpace() {
    return checkDiskSpace(this.getPathToFilesDirectory());
  }

  private getPathToFilesDirectory() {
    return `/home/node/app/${this.filesDirectoryBasePath}`;
  }
}
