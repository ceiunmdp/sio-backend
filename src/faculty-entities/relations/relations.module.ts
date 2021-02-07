import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { CareerCourseRelation } from './entities/career-course-relation.entity';
import { Relation } from './entities/relation.entity';
//! Profiles
import './profiles/relation.profile';
import { RelationsController } from './relations.controller';
import { RelationsRepository } from './relations.repository';
import { RelationsService } from './relations.service';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([Relation, CareerCourseRelation, RelationsRepository])],
  controllers: [RelationsController],
  providers: [RelationsService],
  exports: [RelationsService],
})
export class RelationsModule {}
