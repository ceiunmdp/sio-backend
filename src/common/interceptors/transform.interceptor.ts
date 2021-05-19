import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import * as camelCaseKeys from 'camelcase-keys';
import { Request } from 'express';
import { isObject } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import snakeCaseKeys from 'snakecase-keys';
import { isHttp } from '../utils/is-application-context-functions';

export interface Response<T> {
  data: T | WsResponse<T>;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<any>> {
    if (isHttp(context)) {
      const request = context.switchToHttp().getRequest<Request>();
      request.body = camelCaseKeys(request.body, { deep: true });
    } else {
      //* WS
      const data = context.switchToWs().getData();
      camelCaseKeys(data, { deep: true });
    }

    return next.handle().pipe(
      map((response) => {
        if (isHttp(context)) {
          return { data: this.snakeCaseProperties(response) };
        } else {
          //* WS
          const res = response as unknown as WsResponse;
          res.data = this.snakeCaseProperties(res.data);
          return res;
        }
      }),
    );
  }

  private snakeCaseProperties(data: T) {
    return isObject(data) ? snakeCaseKeys(data) : data;
  }
}
