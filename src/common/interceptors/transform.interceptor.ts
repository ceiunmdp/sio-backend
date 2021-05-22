import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import * as camelcaseKeys from 'camelcase-keys';
import { Request } from 'express';
import { isObject } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as snakecaseKeys from 'snakecase-keys';
import { isHttp } from '../utils/is-application-context-functions';

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
    return isObject(data) ? snakecaseKeys(data, { deep: true }) : data;
  }
}
