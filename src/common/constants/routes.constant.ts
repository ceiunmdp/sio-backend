import { Routes } from 'nest-router';
import { CampusModule } from 'src/faculty-entities/campus/campus.module';
import { CareersModule } from 'src/faculty-entities/careers/careers.module';
import { CoursesModule } from 'src/faculty-entities/courses/courses.module';
import { RelationsModule } from 'src/faculty-entities/relations/relations.module';
import { MenuModule } from 'src/menu/menu.module';
import { UserModule } from 'src/user/user.module';
import { AdminsModule } from 'src/users/admins/admins.module';
import { CampusUsersModule } from 'src/users/campus-users/campus-users.module';
import { GeneralUsersModule } from 'src/users/general-users.module';
import { ProfessorshipsModule } from 'src/users/professorships/professorships.module';
import { ScholarshipsModule } from 'src/users/scholarships/scholarships.module';
import { StudentsModule } from 'src/users/students/students.module';
import { UsersModule } from 'src/users/users/users.module';
import { AuthModule } from '../../auth/auth.module';
import { FacultyEntitiesModule } from '../../faculty-entities/faculty-entities.module';
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
    path: Path.AUTH,
    module: AuthModule,
  },
  {
    path: Path.HEALTH,
    module: HealthModule,
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
    path: '',
    module: GeneralUsersModule,
    children: [
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
    ],
  },
  {
    path: '',
    module: FacultyEntitiesModule,
    children: [
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
    ],
  },
];
