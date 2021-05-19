import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsResponse } from '@nestjs/websockets';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomLoggerService } from 'src/global/custom-logger.service';
import { isHttp } from '../utils/is-application-context-functions';

@Injectable()
export class MapperInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly reflector: Reflector,
    @InjectMapper() private readonly mapper: AutoMapper,
  ) {
    this.logger.context = MapperInterceptor.name;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const destination = this.reflector.get('destination', context.getHandler());
    return next.handle().pipe(
      map((response) => {
        if (isHttp(context)) {
          return this.mapData(response, destination);
        } else {
          //* WS
          const res = response as unknown as WsResponse;
          res.data = this.mapData(res.data, destination);
          return res;
        }
      }),
    );
  }

  private mapData(source: any, destination: any) {
    if (source instanceof Pagination) {
      const mappedItems = this.mapArray(source.items, destination);
      Object.assign(source.items, mappedItems);
      return source;
    } else if (Array.isArray(source)) {
      return this.mapArray(source, destination);
    } else {
      // Object
      return this.mapper.map(source, destination);
    }
  }

  private mapArray(items: any[], destination: any) {
    return this.mapper.mapArray(items, destination);
  }
}
