import { Serializable } from './serializable';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserRole } from './../users/user-role';
import { User } from './../users/user.entity';

export interface AuthenticatedRequest extends Request {
    readonly user: User;
}

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
    private async serializeResponse(response: Response, role: UserRole): Promise<Record<string, any>> {
        const serializedProperties = await Promise.all(
            Object.keys(response).map(async key => {
                const value = response[key];

                if (!(value instanceof Serializable)) {
                    return {
                        key,
                        value,
                    };
                }

                const serializedValue = await value.serialize(role);

                return {
                    key,
                    value: serializedValue,
                };
            }),
        );

        return serializedProperties.reduce((result, { key, value }) => {
            result[key] = value;

            return result;
        }, {});
    }

    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        console.log('Paso');

        return next.handle().pipe(
            switchMap(response => {
                if (typeof response !== 'object' || response === null) {
                    return of(response);
                }
                console.log(response);

                return from(this.serializeResponse(response, request.user?.role));
            }),
        );
    }
}
