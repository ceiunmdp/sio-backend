import { CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    // TODO: check if context identification (HTTP|WS) is needed
    const request = context.switchToHttp().getRequest<Request>();
    const isGetRequest = request.method === 'GET';

    //* Exclude all endpoints that aren't a GET or are protected
    if (!isGetRequest || (isGetRequest && request.headers.authorization)) {
      return undefined; // No key found, continue to endpoint to retrieve data
    } else {
      return request.url; // Endpoint's key
    }
  }
}
