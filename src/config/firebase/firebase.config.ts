import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => ({
  apiKey: process.env.FIREBASE_API_KEY,
}));
