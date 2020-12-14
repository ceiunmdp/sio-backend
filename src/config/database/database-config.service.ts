import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import { isTrue } from 'src/common/utils/is-true';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

interface DatabaseEnvironmentVariables {
  'typeorm.connection': string;
  'typeorm.host': string;
  'typeorm.port': number;
  'typeorm.username': string;
  'typeorm.password': string;
  'typeorm.database': string;
  'typeorm.schema': string;
  'typeorm.logging': LoggerOptions;
  'typeorm.logger': string;
  'typeorm.maxQueryExecutionTime': number;
  'typeorm.synchronize': boolean;
  'typeorm.migrationsRun': boolean;
  'typeorm.migrations': string;
  'typeorm.migrationsDir': string;
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
    return +this.configService.get<number>('typeorm.port');
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

  get schema() {
    return this.configService.get<string>('typeorm.schema');
  }

  get logging() {
    return this.configService.get<LoggerOptions>('typeorm.logging');
  }

  get logger() {
    return this.configService.get<string>('typeorm.logger');
  }

  get maxQueryExecutionTime() {
    return +this.configService.get<number>('typeorm.maxQueryExecutionTime');
  }

  get synchronize() {
    return isTrue(this.configService.get('typeorm.synchronize'));
  }

  get migrationsRun() {
    return isTrue(this.configService.get('typeorm.migrationsRun'));
  }

  get migrations() {
    return this.configService.get<string>('typeorm.migrations');
  }

  get migrationsDir() {
    return this.configService.get<string>('typeorm.migrationsDir');
  }

  get connectionLimit() {
    return +this.configService.get<number>('typeorm.connectionLimit');
  }

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    const options: MysqlConnectionOptions | PostgresConnectionOptions = {
      type: this.connection as 'mysql' | 'mariadb' | 'postgres',
      name: connectionName,
      // url: `${this.connection}://${this.host}:${this.port}/${this.database}`,
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
      schema: this.schema,
      logging: this.logging, // boolean | "all" | ("query" | "schema" | "error" | "warn" | "info" | "log" | "migration")[]
      logger: this.logger as 'advanced-console' | 'simple-console' | 'file' | 'debug',
      maxQueryExecutionTime: this.maxQueryExecutionTime, // Log long-running queries
      synchronize: this.synchronize,
      migrationsRun: this.migrationsRun,
      migrations: [join(__dirname, this.migrations)],
      cli: {
        migrationsDir: join(__dirname, this.migrationsDir),
      },
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
