import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { FacultyEntitiesModule } from './faculty-entities/faculty-entities.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [CoreModule, AuthModule, FacultyEntitiesModule, UsersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
