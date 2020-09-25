import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { FilesModule } from 'src/files/files.module';
import { SharedModule } from 'src/shared/shared.module';
import { CoursesController } from './courses.controller';
import { CoursesRepository } from './courses.repository';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
//! Profiles
import './profiles/course.profile';

@Module({
  imports: [SharedModule, AppConfigModule, FilesModule, TypeOrmModule.forFeature([Course, CoursesRepository])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
