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
import bytes from 'bytes';
import { Collection } from 'src/common/enums/collection.enum';

@ApiTags(Collection.HEALTH)
@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private typeOrm: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthcheck() {
    return this.health.check([
      // DNS Healthcheck
      () => this.http.pingCheck('google', 'https://google.com', { timeout: 300 }),

      // Database Healthcheck
      () => this.typeOrm.pingCheck('database', { timeout: 300 }),

      // The process should not use more than 500MB memory
      () => this.memory.checkHeap('memory_heap', bytes('500MB')),

      // The process should not have more than 150MB allocated
      () => this.memory.checkRSS('memory_rss', bytes('500MB')),

      // The used disk storage should not exceed 50% of the full disk size
      () => this.disk.checkStorage('storage', { thresholdPercent: 0.5, path: '/' }),
      // () => this.disk.checkStorage('storage', { thresholdPercent: 0.5, path: 'C:\\' }),
    ]);
  }
}
