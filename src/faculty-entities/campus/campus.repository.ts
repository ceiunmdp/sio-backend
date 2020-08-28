import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Campus } from './entities/campus.entity';

@EntityRepository(Campus)
export class CampusRepository extends BaseRepository<Campus> {}
