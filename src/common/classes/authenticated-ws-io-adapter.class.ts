import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http';
import { ServerOptions } from 'socket.io';
import { AppConfigService } from 'src/config/app/app-config.service';
import { AuthNGuard } from '../guards/authn.guard';
import { getToken } from '../utils/get-token';

export class AuthenticatedWsIoAdapter extends IoAdapter {
  private readonly authNGuard: AuthNGuard;
  private readonly appConfigService: AppConfigService;

  constructor(private app: INestApplicationContext) {
    super(app);
    this.authNGuard = this.app.get(AuthNGuard);
    this.appConfigService = this.app.get(AppConfigService);
  }

  createIOServer(port: number, options?: ServerOptions) {
    options.allowRequest = async (request, allowFunction) => {
      const authorization = request.headers.authorization;
      if (authorization) {
        try {
          await this.authNGuard.verifyAndDecodeToken(getToken(authorization), false);
          return allowFunction(null, true);
        } catch (error) {
          return allowFunction('Unauthorized', false);
        }
      } else {
        return allowFunction('Unauthorized', false);
      }
    };

    options.handlePreflightRequest = (req, res) => {
      const request = req as unknown as IncomingMessage;
      const response = res as unknown as ServerResponse;

      const headers: OutgoingHttpHeaders = {
        'Access-Control-Allow-Headers': ['Content-Type', 'Authorization'],
        'Access-Control-Allow-Origin': this.appConfigService.isProduction()
          ? this.appConfigService.origin
          : request.headers.origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': 86400,
      };
      response.writeHead(200, headers);
      response.end();
    };

    return super.createIOServer(port, options);
  }
}
