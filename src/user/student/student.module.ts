import { Module } from '@nestjs/common';
import { StudentsModule } from 'src/users/students/students.module';
import { UsersModule } from 'src/users/users/users.module';
//! Profiles
import './profiles/logged-in-student.profile';
import { StudentController } from './student.controller';

@Module({
  imports: [UsersModule, StudentsModule],
  controllers: [StudentController],
})
export class StudentModule {}
