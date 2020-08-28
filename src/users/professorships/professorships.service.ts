import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Professorship } from './entities/professorship.entity';

@Injectable()
export class ProfessorshipsService {
  async findById(id: string, manager: EntityManager) {
    return new Professorship({});
  }
}
