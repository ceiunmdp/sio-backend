import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

interface DatabaseEnvironmentVariables {
  'typeorm.connection': string;
  'typeorm.host': string;
  'typeorm.port': number;
  'typeorm.username': string;
  'typeorm.password': string;
  'typeorm.database': string;
  'typeorm.synchronize': boolean;
  'typeorm.logging': LoggerOptions;
  'typeorm.logger': string;
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
    return this.configService.get<LoggerOptions>('typeorm.logging');
  }

  get logger() {
    return this.configService.get<string>('typeorm.logger');
  }

  get connectionLimit() {
    return this.configService.get<number>('typeorm.connectionLimit');
  }

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    const options: MysqlConnectionOptions = {
      type: this.connection as 'mysql' | 'mariadb',
      name: connectionName,
      // url: `${this.connection}://${this.host}:${this.port}/${this.database}`,
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
      logging: this.logging, // boolean | "all" | ("query" | "schema" | "error" | "warn" | "info" | "log" | "migration")[]
      logger: this.logger as 'advanced-console' | 'simple-console' | 'file' | 'debug',
      synchronize: this.synchronize,
      // maxQueryExecutionTime: 1000, // Log long-running queries
      // dropSchema: true,
      // cache: {
      //   alwaysEnabled: false, // boolean
      //   type: 'database', // "database" | "redis" | "ioredis"
      //   tableName: 'query-result-cache', // If database is selected
      //   duration: 30 * 1000, // 30 seg
      //   options: {
      //     // If redis is enabled
      //     host: 'localhost',
      //     port: 6379,
      //   },
      // },
      // replication: {
      //   master: {
      //     url: 'url',
      //     host: 'server1',
      //     port: 3306,
      //     username: 'user',
      //     password: 'password',
      //     database: 'database',
      //   },
      //   slaves: [
      //     {
      //       url: 'url',
      //       host: 'server2',
      //       port: 3306,
      //       username: 'user',
      //       password: 'password',
      //       database: 'database',
      //     },
      //   ],
      //   selector: 'RR', // "RR" | "RANDOM" | "ORDER"
      // },
      extra: { connectionLimit: this.connectionLimit },
    };

    return {
      ...options,
      autoLoadEntities: true,
      keepConnectionAlive: true,
    };
  }
}
