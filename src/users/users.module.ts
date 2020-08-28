import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { CampusUsersModule } from './campus-users/campus-users.module';
import { FirebaseUsersModule } from './firebase-users/firebase-users.module';
import { ProfessorshipsModule } from './professorships/professorships.module';
import { ScholarshipsModule } from './scholarships/scholarships.module';
import { StudentsModule } from './students/students.module';
@Module({
  imports: [
    AdminsModule,
    CampusUsersModule,
    FirebaseUsersModule,
    ProfessorshipsModule,
    ScholarshipsModule,
    StudentsModule,
  ],
  exports: [
    AdminsModule,
    CampusUsersModule,
    FirebaseUsersModule,
    ProfessorshipsModule,
    ScholarshipsModule,
    StudentsModule,
  ],
})
export class UsersModule {}
