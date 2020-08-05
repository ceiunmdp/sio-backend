import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { HttpCacheInterceptor } from './common/interceptors/http-cache.interceptor';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { SerializerInterceptor } from './common/interceptors/serializer.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CoreModule } from './core/core.module';
import { FacultyEntitiesModule } from './faculty-entities/faculty-entities.module';
import { FilesModule } from './files/files.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [CoreModule, SharedModule, AuthModule, FacultyEntitiesModule, FilesModule], // UsersModule],
  providers: [
    // Request -> Middlewares -> Guards -> Interceptors -> Pipes -> Request Handler -> Interceptors -> Filters -> Middlewares -> Response

    // Enable ErrorsInterceptor globally
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },

    // Enable LoggerInterceptor globally
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },

    // Enable HttpCacheInterceptor globally
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },

    // Enable TimeoutInterceptor globally
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },

    // Enable TransformInterceptor globally
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    // Set up global interceptor to serialize responses
    {
      provide: APP_INTERCEPTOR,
      // useClass: ClassSerializerInterceptor,
      useClass: SerializerInterceptor,
    },

    // Enable AllExceptionsFilter globally
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    // Enable ValidationPipe globally (every DTO is automatically validated)
    // {
    //     provide: APP_PIPE,
    //     useClass: ValidationPipe, // Use app.useGlobalPipes() in case of custom configuration needed
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
