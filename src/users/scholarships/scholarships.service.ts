import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Scholarship } from './entities/scholarship.entity';

@Injectable()
export class ScholarshipsService {
  async findById(id: string, manager: EntityManager) {
    return new Scholarship({});
  }
}
