import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { utilities as nestWinstonModuleUtilities, WinstonModuleOptions } from 'nest-winston';
import { Environment } from 'src/common/enums/environment.enum';
import { format, transports } from 'winston';
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

  getFormat() {
    const { combine, timestamp, json } = format;
    if (this.appConfigService.env === Environment.DEVELOPMENT) {
      return combine(
        // colorize(),
        timestamp({ format: 'DD/MM/YYYY, HH:MM:ss' }),
        nestWinstonModuleUtilities.format.nestLike('Nest'),
      );
    } else {
      return combine(timestamp({ format: 'isoDateTime' }), json());
    }
  }

  getTransports() {
    if (this.appConfigService.env === Environment.DEVELOPMENT) {
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

  getCustomFormat() {
    return format.printf(({ level, message, context, timestamp }) => {
      return `${timestamp}  [${context}] ${level}: ${message}`;
    });
  }

  getOptions(): WinstonModuleOptions {
    return {
      level: 'info',
      // defaultMeta: { service: 'nest' },
      format: this.getFormat(),
      transports: this.getTransports(),
    };
  }
}
