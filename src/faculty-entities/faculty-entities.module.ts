import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { SharedModule } from 'src/shared/shared.module';
import { Campus } from './campus/entities/campus.entity';
import { CareersController } from './careers/careers.controller';
import { CareersRepository } from './careers/careers.repository';
import { CareersService } from './careers/careers.service';
import { Career } from './careers/entities/career.entity';
//! Profiles
// import './careers/profiles/career.profile';
import { CoursesController } from './courses/courses.controller';
import { CoursesService } from './courses/courses.service';
import { Course } from './courses/entities/course.entity';
import { CareerCourseRelation } from './relations/entities/career-course-relation.entity';
import { Relation } from './relations/entities/relation.entity';
import { RelationsController } from './relations/relations.controller';
import { RelationsService } from './relations/relations.service';

@Module({
  imports: [
    SharedModule,
    AppConfigModule,
    TypeOrmModule.forFeature([Campus, Career, Course, Relation, CareerCourseRelation, CareersRepository]),
  ],
  providers: [CareersService, CoursesService, RelationsService],
  controllers: [CareersController, CoursesController, RelationsController],
})
export class FacultyEntitiesModule {}
