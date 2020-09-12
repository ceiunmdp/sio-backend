import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Movement } from './entities/movement.entity';

@EntityRepository(Movement)
export class MovementsRepository extends BaseRepository<Movement> {}
