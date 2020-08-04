import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { format, LoggerOptions, transports } from 'winston';
import 'winston-daily-rotate-file';
import { AppConfigService } from '../app/app-config.service';

interface LoggerEnvironmentVariables {
  'logger.datePattern': string;
  'logger.dirname': string;
  'logger.maxSize': string;
  'logger.maxFiles': number;
  'logger.maxDays': string;
  'logger.zipped': boolean;
}

@Injectable()
export class LoggerConfigService {
  constructor(
    private readonly configService: ConfigService<LoggerEnvironmentVariables>,
    private readonly appConfigService: AppConfigService,
  ) {}

  get format() {
    const { combine, timestamp, json } = format;
    if (this.appConfigService.env === 'development') {
      return combine(
        // colorize(),
        timestamp({ format: 'DD/MM/YYYY, HH:MM:ss' }),
        nestWinstonModuleUtilities.format.nestLike('Nest'),
      );
    } else {
      return combine(timestamp({ format: 'isoDateTime' }), json());
    }
  }

  get transports() {
    if (this.appConfigService.env === 'development') {
      return [new transports.Console()];
    } else {
      return [
        // Write all logs with default level and below to `combined.log`
        new transports.DailyRotateFile({
          // level: 'info', // Takes default
          filename: 'combined.%DATE%.log',
          dirname: this.configService.get<string>('logger.dirname'),
          datePattern: this.configService.get<string>('logger.datePattern'),
          zippedArchive: this.configService.get<boolean>('logger.zipped'),
          maxSize: this.configService.get<string>('logger.maxSize'),
          maxFiles:
            this.configService.get<number>('logger.maxFiles') || this.configService.get<string>('logger.maxDays'),
        }),
        // Write all logs with level `error` and below to `error.log`
        new transports.DailyRotateFile({
          level: 'error',
          filename: 'error.%DATE%.log',
          dirname: this.configService.get<string>('logger.dirname'),
          datePattern: this.configService.get<string>('logger.datePattern'),
          zippedArchive: this.configService.get<boolean>('logger.zipped'),
          maxSize: this.configService.get<string>('logger.maxSize'),
          maxFiles:
            this.configService.get<number>('logger.maxFiles') || this.configService.get<string>('logger.maxDays'),
        }),
      ];
    }
  }

  get customFormat() {
    return format.printf(({ level, message, context, timestamp }) => {
      return `${timestamp}  [${context}] ${level}: ${message}`;
    });
  }

  get options(): LoggerOptions {
    return {
      level: 'info',
      // defaultMeta: { service: 'nest' },
      format: this.format,
      transports: this.transports,
    };
  }
}
