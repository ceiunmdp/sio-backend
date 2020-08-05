import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  store: process.env.CACHE_STORE,
  ttl: process.env.CACHE_TTL,
  max: process.env.CACHE_MAX,
}));
