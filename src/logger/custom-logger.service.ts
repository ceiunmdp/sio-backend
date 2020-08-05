import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from 'src/config/logger/logger-config.service';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
  private _logger: LoggerService;
  private _context = 'DefaultContext';

  constructor(private readonly loggerConfigService: LoggerConfigService) {
    this._logger = WinstonModule.createLogger(this.loggerConfigService.getOptions());
  }

  public get context() {
    return this._context;
  }

  public set context(context: string) {
    this._context = context;
  }

  log(message: any, context?: string) {
    this._logger.log(message, context ? context : this._context);
  }

  error(message: any, trace?: string, context?: string) {
    this._logger.error(message, trace, context ? context : this._context);
  }

  warn(message: any, context?: string) {
    this._logger.warn(message, context ? context : this._context);
  }

  debug(message: any, context?: string) {
    this._logger.debug(message, context ? context : this._context);
  }

  verbose(message: any, context?: string) {
    this._logger.verbose(message, context ? context : this._context);
  }
}
