import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

interface DatabaseEnvironmentVariables {
  'typeorm.connection': string;
  'typeorm.host': string;
  'typeorm.port': number;
  'typeorm.username': string;
  'typeorm.password': string;
  'typeorm.database': string;
  'typeorm.synchronize': boolean;
  'typeorm.logging': boolean;
  'typeorm.connectionLimit': number;
}

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<DatabaseEnvironmentVariables>) {}

  get connection() {
    return this.configService.get<string>('typeorm.connection');
  }

  get host() {
    return this.configService.get<string>('typeorm.host');
  }

  get port() {
    return this.configService.get<number>('typeorm.port');
  }

  get username() {
    return this.configService.get<string>('typeorm.username');
  }

  get password() {
    return this.configService.get<string>('typeorm.password');
  }

  get database() {
    return this.configService.get<string>('typeorm.database');
  }

  get synchronize() {
    return this.configService.get<boolean>('typeorm.synchronize');
  }

  get logging() {
    return this.configService.get<boolean>('typeorm.logging');
  }

  get connectionLimit() {
    return this.configService.get<number>('typeorm.connectionLimit');
  }

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    const options: MysqlConnectionOptions = {
      type: this.connection as 'mysql' | 'mariadb',
      name: connectionName,
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
      logging: this.logging,
      // logger:
      synchronize: this.synchronize,
      extra: { connectionLimit: this.connectionLimit },
    };

    return {
      ...options,
      autoLoadEntities: true,
      keepConnectionAlive: true,
    };
  }
}
