import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { ParametersModule } from 'src/config/parameters/parameters.module';
import { ScholarshipsModule } from '../scholarships/scholarships.module';
import { UsersModule } from '../users/users.module';
import { Student } from './entities/student.entity';
//! Profiles
import './profiles/student.profile';
import { StudentsController } from './students.controller';
import { StudentsRepository } from './students.repository';
import { StudentsService } from './students.service';

@Module({
  imports: [
    AppConfigModule,
    ParametersModule,
    UsersModule,
    forwardRef(() => ScholarshipsModule),
    TypeOrmModule.forFeature([Student, StudentsRepository]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
