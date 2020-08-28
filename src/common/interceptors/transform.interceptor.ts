import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as camelCaseKeys from 'camelcase-keys';
import { Request } from 'express';
import { isObject } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as snakeCaseKeys from 'snakecase-keys';
export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest<Request>();

    request.body = camelCaseKeys(request.body);

    return next.handle().pipe(
      map((data) => {
        if (isObject(data)) {
          data = snakeCaseKeys(data);
        }
        return { data };
      }),
    );
  }
}
