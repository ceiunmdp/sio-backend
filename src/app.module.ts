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
import { ItemsModule } from './items/items.module';
import { MenuModule } from './menu/menu.module';
import { MovementsModule } from './movements/movements.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';

// export const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    AuthModule,
    CoreModule,
    FacultyEntitiesModule,
    FilesModule,
    ItemsModule,
    MenuModule,
    MovementsModule,
    NotificationsModule,
    OrdersModule,
    UserModule,
    UsersModule,
  ],
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

    // Enable ValidationPipe globally (every DTO is automatically validated)
    // {
    //   provide: APP_PIPE,
    //   useValue: new ValidationPipe({
    //     // skipMissingProperties: true,
    //     whitelist: true, // Strip all properties that don't have any decorators
    //     forbidNonWhitelisted: true, // In combination with the previous flag, it'll throw an error when there's any extra property
    //     forbidUnknownValues: true, // Prevent unknown objects from passing validation
    //     // disableErrorMessages: true, // Useful in production
    //     errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    //     transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    //   }),
    // },

    // Enable AllExceptionsFilter globally
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
