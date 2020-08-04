import { registerAs } from '@nestjs/config';

export default registerAs('api.speed', () => ({
  timeframe: process.env.API_SPEED_LIMITER_TIMEFRAME,
  delayAfter: process.env.API_SPEED_LIMITER_DELAY_AFTER,
  delayMS: process.env.API_SPEED_LIMITER_DELAY_MS,
  maxDelayMS: process.env.API_SPEED_LIMITER_MAX_DELAY_MS,
}));
