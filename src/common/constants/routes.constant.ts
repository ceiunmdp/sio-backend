import { Routes } from 'nest-router';
import { ParametersModule } from 'src/config/parameters/parameters.module';
import { CampusModule } from 'src/faculty-entities/campus/campus.module';
import { CareersModule } from 'src/faculty-entities/careers/careers.module';
import { CoursesModule } from 'src/faculty-entities/courses/courses.module';
import { RelationsModule } from 'src/faculty-entities/relations/relations.module';
import { FilesModule } from 'src/files/files.module';
import { BindingsModule } from 'src/items/bindings/bindings.module';
import { ItemsModule } from 'src/items/items/items.module';
import { MenuModule } from 'src/menu/menu.module';
import { MovementsModule } from 'src/movements/movements.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { RegistrationTokensModule } from 'src/notifications/registration-tokens/registration-tokens.module';
import { PrintersModule } from 'src/printers/printers.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { UserModule } from 'src/user/user.module';
import { AdminsModule } from 'src/users/admins/admins.module';
import { CampusUsersModule } from 'src/users/campus-users/campus-users.module';
import { ProfessorshipsModule } from 'src/users/professorships/professorships.module';
import { ScholarshipsModule } from 'src/users/scholarships/scholarships.module';
import { StudentsModule } from 'src/users/students/students.module';
import { UsersModule } from 'src/users/users/users.module';
import { HealthModule } from '../../health/health.module';
import { Path } from '../enums/path.enum';

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
    path: Path.HEALTH,
    module: HealthModule,
  },
  {
    path: Path.PARAMETERS,
    module: ParametersModule,
  },
  {
    path: Path.TASKS,
    module: TasksModule,
  },
  {
    path: Path.MENU,
    module: MenuModule,
  },
  {
    path: Path.USER,
    module: UserModule,
  },
  {
    path: Path.USERS,
    module: UsersModule,
    children: [
      {
        path: Path.ADMINS,
        module: AdminsModule,
      },
      {
        path: Path.CAMPUS_USERS,
        module: CampusUsersModule,
      },
      {
        path: Path.PROFESSORSHIPS,
        module: ProfessorshipsModule,
      },
      {
        path: Path.SCHOLARSHIPS,
        module: ScholarshipsModule,
      },
      {
        path: Path.STUDENTS,
        module: StudentsModule,
      },
    ],
  },
  {
    path: Path.CAMPUS,
    module: CampusModule,
  },
  {
    path: Path.CAREERS,
    module: CareersModule,
  },
  {
    path: Path.COURSES,
    module: CoursesModule,
  },
  {
    path: Path.RELATIONS,
    module: RelationsModule,
  },
  {
    path: Path.ITEMS,
    module: ItemsModule,
    children: [
      {
        path: Path.BINDINGS,
        module: BindingsModule,
      },
    ],
  },
  {
    path: Path.MOVEMENTS,
    module: MovementsModule,
  },
  {
    path: Path.NOTIFICATIONS,
    module: NotificationsModule,
  },
  {
    path: Path.REGISTRATION_TOKENS,
    module: RegistrationTokensModule,
  },
  {
    path: Path.FILES,
    module: FilesModule,
  },
  {
    path: Path.PRINTERS,
    module: PrintersModule,
  },
];
