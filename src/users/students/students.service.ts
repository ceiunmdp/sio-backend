import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  async findById(id: string, manager: EntityManager) {
    return new Student({});
  }
}
