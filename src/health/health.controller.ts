import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  DNSHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import * as bytes from 'bytes';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator,
    private typeOrm: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthcheck() {
    return this.health.check([
      // DNS Healthcheck
      () => this.dns.pingCheck('google', 'https://google.com'),

      // Database Healthcheck
      () => this.typeOrm.pingCheck('database'),

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
