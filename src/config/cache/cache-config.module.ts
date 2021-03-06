import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CacheConfigService } from './cache-config.service';
import cacheConfig from './cache.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${(process.env.NODE_ENV || 'local').toLowerCase()}.env`,
      load: [cacheConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        CACHE_STORE: Joi.valid(
          'memory',
          'redisStore',
          'mongoStore',
          'mongooseStore',
          'fsStore',
          'hazelcastStore',
          'memcachedStore',
          'MemoryStore',
        ).default('memory'),
        CACHE_TTL: Joi.number().min(5).max(3600).default(60), // Time to live [seconds]
        CACHE_MAX: Joi.number().min(10).max(100).default(10), // Maximum number of items in cache
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [CacheConfigService],
  exports: [CacheConfigService],
})
export class CacheConfigModule {}
