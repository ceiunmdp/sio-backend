import { Module } from '@nestjs/common';
import { CampusModule } from './campus/campus.module';
import { CareersModule } from './careers/careers.module';
//! Profiles
import './careers/profiles/career.profile';
import { CoursesModule } from './courses/courses.module';
import './courses/profiles/course.profile';
import './relations/profiles/relation.profile';
import { RelationsModule } from './relations/relations.module';

@Module({
  imports: [CampusModule, CareersModule, CoursesModule, RelationsModule],
  exports: [CampusModule, CareersModule, CoursesModule, RelationsModule],
})
export class FacultyEntitiesModule {}
