import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Course } from './entities/course.entity';

@EntityRepository(Course)
export class CoursesRepository extends BaseRepository<Course> {}
