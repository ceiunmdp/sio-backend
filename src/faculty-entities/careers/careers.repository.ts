import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Career } from './entities/career.entity';

@EntityRepository(Career)
export class CareersRepository extends BaseRepository<Career> {}
