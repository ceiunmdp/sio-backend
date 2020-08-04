import { registerAs } from '@nestjs/config';

export default registerAs('api.rate', () => ({
  timeframe: process.env.API_RATE_LIMITER_TIMEFRAME,
  maxConnections: process.env.API_RATE_LIMITER_MAX_CONNECTIONS,
}));
