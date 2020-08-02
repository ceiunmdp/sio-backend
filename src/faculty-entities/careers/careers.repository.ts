import { BaseRepository } from 'src/common/classes/base-repository.class';
import { EntityRepository } from 'typeorm';
import { Career } from './entities/career.entity';

@EntityRepository(Career)
export class CareersRepository extends BaseRepository<Career> {}
