import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import * as camelcaseKeys from 'camelcase-keys';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isHttp } from '../utils/is-application-context-functions';
import { snakeCaseProperties } from '../utils/snakeCaseProperties';

export interface Response<T> {
  data: T | WsResponse<T>;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<any>> {
    if (isHttp(context)) {
      const request = context.switchToHttp().getRequest<Request>();
      request.body = camelcaseKeys(request.body, { deep: true });
    } else {
      //* WS
      const data = context.switchToWs().getData();
      camelcaseKeys(data, { deep: true });
    }

    return next.handle().pipe(
      map((response) => {
        if (isHttp(context)) {
          return { data: snakeCaseProperties(response) };
        } else {
          //* WS
          const res = response as unknown as WsResponse;
          res.data = snakeCaseProperties(res.data);
          return res;
        }
      }),
    );
  }
}
