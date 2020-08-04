import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface DatabaseEnvironmentVariables {
  'database.type': string;
  'database.host': string;
  'database.port': number;
  'database.username': string;
  'database.password': string;
  'database.name': string;
}

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService<DatabaseEnvironmentVariables>) {}

  get type() {
    return this.configService.get<string>('database.type');
  }

  get host() {
    return this.configService.get<string>('database.host');
  }

  get port() {
    return this.configService.get<number>('database.port');
  }

  get username() {
    return this.configService.get<string>('database.username');
  }

  get password() {
    return this.configService.get<string>('database.password');
  }

  get name() {
    return this.configService.get<string>('database.name');
  }
}
