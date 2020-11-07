import { ArgumentsHost } from '@nestjs/common';
import { ApplicationContext } from '../enums/application-context.enum';

export const isHttp = (host: ArgumentsHost) => host.getType() === ApplicationContext.HTTP;

export const isWs = (host: ArgumentsHost) => host.getType() === ApplicationContext.WS;
