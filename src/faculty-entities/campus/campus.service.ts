import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CampusRepository } from './campus.repository';

@Injectable()
export class CampusService {
  async findById(id: string, manager: EntityManager) {
    const campus = await manager.getCustomRepository(CampusRepository).findOne(id);

    if (campus) {
      return campus;
    } else {
      throw new NotFoundException(`Sede ${id} no encontrada.`);
    }
  }
}
