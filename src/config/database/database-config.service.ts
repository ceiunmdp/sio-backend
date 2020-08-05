import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

interface DatabaseEnvironmentVariables {
  'database.type': string;
  'database.host': string;
  'database.port': number;
  'database.username': string;
  'database.password': string;
  'database.name': string;
  'database.synchronize': boolean;
  'database.connectionLimit': number;
}

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
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

  get synchronize() {
    return this.configService.get<boolean>('database.synchronize');
  }

  get connectionLimit() {
    return this.configService.get<number>('database.connectionLimit');
  }

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    const options: MysqlConnectionOptions = {
      type: this.type as 'mysql' | 'mariadb',
      name: connectionName,
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.name,
      // logging:
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
