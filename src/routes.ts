import { Routes } from 'nest-router';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FacultyEntitiesModule } from './faculty-entities/faculty-entities.module';

export enum Paths {
  API = 'api/v1',
  AUTH = 'auth',
  HEALTH = 'health',
  USERS = 'users',
  CAREERS = 'careers',
}

export const routes: Routes = [
  {
    path: Paths.AUTH,
    module: AuthModule,
  },
  {
    path: Paths.HEALTH,
    module: HealthModule,
  },
  {
    path: Paths.USERS,
    module: UsersModule,
  },
  {
    path: '',
    module: FacultyEntitiesModule,
  },
];
