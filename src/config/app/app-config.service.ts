import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paths } from 'src/common/enums/paths';

interface EnvironmentVariables {
  'app.env': string;
  'app.url': string;
  'app.port': number;
}

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<EnvironmentVariables>) {}

  get env() {
    return this.configService.get<string>('app.env');
  }

  get url() {
    return this.configService.get<string>('app.url');
  }

  get port() {
    return this.configService.get<number>('app.port');
  }

  get basePath() {
    return `${this.url}/${Paths.API}`;
  }
}
