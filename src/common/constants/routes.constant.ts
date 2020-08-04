import { Routes } from 'nest-router';
import { AuthModule } from '../../auth/auth.module';
import { FacultyEntitiesModule } from '../../faculty-entities/faculty-entities.module';
import { HealthModule } from '../../health/health.module';
import { Paths } from '../enums/paths';

export const routes: Routes = [
  // {
  //   path: '/ninja',
  //   module: NinjaModule,
  //   children: [
  //     {
  //       path: '/:ninjaId/cats',
  //       module: CatsModule,
  //     },
  //     {
  //       path: '/:ninjaId/dogs',
  //       module: DogsModule,
  //     },
  //   ],
  // },
  {
    path: Paths.AUTH,
    module: AuthModule,
  },
  {
    path: Paths.HEALTH,
    module: HealthModule,
  },
  // {
  //   path: Paths.USERS,
  //   module: UsersModule,
  // },
  {
    path: '',
    module: FacultyEntitiesModule,
  },
];
