import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ApiEnvironmentVariables {
  'api.rate.timeframe': number;
  'api.rate.maxConnections': number;
  'api.speed.timeframe': number;
  'api.speed.delayAfter': number;
  'api.speed.delayMS': number;
  'api.speed.maxDelayMS': number;
}

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService<ApiEnvironmentVariables>) {}

  get rateTimeframe() {
    return this.configService.get<number>('api.rate.timeframe');
  }

  get rateMaxConnections() {
    return this.configService.get<number>('api.rate.maxConnections');
  }

  get speedTimeframe() {
    return this.configService.get<number>('api.speed.timeframe');
  }

  get speedDelayAfter() {
    return this.configService.get<number>('api.speed.delayAfter');
  }

  get speedDelayMS() {
    return this.configService.get<number>('api.speed.delayMS');
  }

  get speedMaxDelayMS() {
    return this.configService.get<number>('api.speed.maxDelayMS');
  }
}
