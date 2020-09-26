import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FirebaseEnvironmentVariables {
  'firebase.apiKey': string;
}

@Injectable()
export class FirebaseConfigService {
  constructor(private readonly configService: ConfigService<FirebaseEnvironmentVariables>) {}

  get apiKey() {
    return this.configService.get<string>('firebase.apiKey');
  }
}
