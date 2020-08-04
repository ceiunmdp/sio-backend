import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { Pagination } from 'nestjs-typeorm-paginate';

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
      map((source) => {
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
      }),
    );
  }

  mapArray(items: any[], destination: any) {
    return this.mapper.mapArray(items, destination);
  }
}
