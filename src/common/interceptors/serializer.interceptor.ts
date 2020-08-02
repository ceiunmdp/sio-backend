import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserIdentity } from '../interfaces/user-identity.interface';

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserIdentity;
    return next.handle().pipe(map((data) => classToPlain(data, { groups: [user?.role] })));
  }
}
