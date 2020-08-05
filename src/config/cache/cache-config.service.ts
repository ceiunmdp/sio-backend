import { CacheModuleOptions, CacheOptionsFactory, CacheStoreFactory, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface CacheEnvironmentVariables {
  'cache.store': string | CacheStoreFactory;
  'cache.ttl': number;
  'cache.max': number;
}

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService<CacheEnvironmentVariables>) {}

  get store() {
    return this.configService.get<string | CacheStoreFactory>('cache.store');
    //* Or return imported cache store in this method
  }

  get ttl() {
    return this.configService.get<number>('cache.ttl');
  }

  get max() {
    return this.configService.get<number>('cache.max');
  }

  createCacheOptions(): CacheModuleOptions {
    return {
      store: this.store,
      ttl: this.ttl,
      max: this.max,
    };
  }
}
