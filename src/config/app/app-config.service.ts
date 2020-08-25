import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from 'src/common/enums/environment.enum';
import { Path } from 'src/common/enums/path.enum';

export interface AppEnvironmentVariables {
  'app.env': string;
  'app.scheme': string;
  'app.host': string;
  'app.port': number;
}

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<AppEnvironmentVariables>) {}

  get env() {
    return this.configService.get<string>('app.env');
  }

  isProduction() {
    return this.env === Environment.PRODUCTION;
  }

  get scheme() {
    return this.configService.get<string>('app.scheme');
  }

  get host() {
    return this.configService.get<string>('app.host');
  }

  get port() {
    return this.configService.get<number>('app.port');
  }

  get origin() {
    return `${this.scheme}://${this.host}:${this.port}`;
  }

  get basePath() {
    return `${this.origin}${Path.API}`;
  }
}
