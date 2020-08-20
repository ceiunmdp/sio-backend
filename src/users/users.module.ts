import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { CampusUser } from './entities/campus-user.entity';
import { Professorship } from './entities/professorship.entity';
import { Role } from './entities/role.entity';
import { Scholarship } from './entities/scholarship.entity';
import { Student } from './entities/student.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
//! Profiles
// import './profiles/user.profile';
// import './profiles/professorship.profile';
// import './profiles/role.profile';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin, CampusUser, Professorship, Scholarship, Student, Role])],
  controllers: [UsersController],
})
export class UsersModule {}
