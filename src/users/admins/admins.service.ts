import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  async findById(id: string, manager: EntityManager) {
    return new Admin({});
  }
}
