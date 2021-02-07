import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { CampusUserModule } from './campus-user/campus-user.module';
import { ProfessorshipModule } from './professorship/professorship.module';
import { ScholarshipModule } from './scholarship/scholarship.module';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AdminModule, CampusUserModule, ProfessorshipModule, ScholarshipModule, StudentModule],
})
export class GeneralUserModule {}
