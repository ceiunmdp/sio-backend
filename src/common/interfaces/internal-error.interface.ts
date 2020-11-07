import { InternalErrorWs } from './internal-error-ws.interface';

export interface InternalError extends InternalErrorWs {
  status: number;
}
