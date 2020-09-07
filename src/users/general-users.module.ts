import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { CampusUsersModule } from './campus-users/campus-users.module';
import { ProfessorshipsModule } from './professorships/professorships.module';
import { ScholarshipsModule } from './scholarships/scholarships.module';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AdminsModule, CampusUsersModule, ProfessorshipsModule, ScholarshipsModule, StudentsModule],
  exports: [UsersModule, AdminsModule, CampusUsersModule, ProfessorshipsModule, ScholarshipsModule, StudentsModule],
})
export class GeneralUsersModule {}
