import { Injectable } from '@nestjs/common';
import { ScholarshipsService } from 'src/users/scholarships/scholarships.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProcessesService {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  async reloadAvailableCopies(manager: EntityManager) {
    return this.scholarshipsService.reloadAvailableCopies(manager);
  }
}
