import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { FacultyEntitiesModule } from './faculty-entities/faculty-entities.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CoreModule, AuthModule, FacultyEntitiesModule, UsersModule],
})
export class AppModule {}
