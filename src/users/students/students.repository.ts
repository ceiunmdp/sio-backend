import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Student } from './entities/student.entity';

@EntityRepository(Student)
export class StudentsRepository extends BaseRepository<Student> {}
