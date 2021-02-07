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
import { BindingGroupsModule } from 'src/orders/binding-groups/binding-groups.module';
import { OrderFilesModule } from 'src/orders/order-files/order-files.module';
import { OrdersModule } from 'src/orders/orders/orders.module';
import { PrintersModule } from 'src/printers/printers.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { AdminModule } from 'src/user/admin/admin.module';
import { CampusUserModule } from 'src/user/campus-user/campus-user.module';
import { ProfessorshipModule } from 'src/user/professorship/professorship.module';
import { ScholarshipModule } from 'src/user/scholarship/scholarship.module';
import { StudentModule } from 'src/user/student/student.module';
import { UserModule } from 'src/user/user/user.module';
import { AdminsModule } from 'src/users/admins/admins.module';
import { CampusUsersModule } from 'src/users/campus-users/campus-users.module';
import { ProfessorshipsModule } from 'src/users/professorships/professorships.module';
import { ScholarshipsModule } from 'src/users/scholarships/scholarships.module';
import { StudentsModule } from 'src/users/students/students.module';
import { UsersModule } from 'src/users/users/users.module';
import { HealthModule } from '../../health/health.module';
import { Path } from '../enums/path.enum';

export const routes: Routes = [
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
    path: Path.FILES,
    module: FilesModule,
  },
  {
    path: Path.HEALTH,
    module: HealthModule,
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
    path: Path.MENU,
    module: MenuModule,
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
    path: Path.ORDERS,
    module: OrdersModule,
    children: [
      {
        path: `/:orderId${Path.ORDER_FILES}`,
        module: OrderFilesModule,
      },
      {
        path: `/:orderId${Path.BINDING_GROUPS}`,
        module: BindingGroupsModule,
      },
    ],
  },
  {
    path: Path.PARAMETERS,
    module: ParametersModule,
  },
  {
    path: Path.PRINTERS,
    module: PrintersModule,
  },
  {
    path: Path.REGISTRATION_TOKENS,
    module: RegistrationTokensModule,
  },
  {
    path: Path.RELATIONS,
    module: RelationsModule,
  },
  {
    path: Path.TASKS,
    module: TasksModule,
  },
  {
    path: Path.USER,
    module: UserModule,
    children: [
      {
        path: Path.ADMIN,
        module: AdminModule,
      },
      {
        path: Path.CAMPUS_USERS,
        module: CampusUserModule,
      },
      {
        path: Path.PROFESSORSHIP,
        module: ProfessorshipModule,
      },
      {
        path: Path.SCHOLARSHIP,
        module: ScholarshipModule,
      },
      {
        path: Path.STUDENT,
        module: StudentModule,
      },
    ],
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
];
