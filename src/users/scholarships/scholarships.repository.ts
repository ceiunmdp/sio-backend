import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Scholarship } from './entities/scholarship.entity';

@EntityRepository(Scholarship)
export class ScholarshipsRepository extends BaseRepository<Scholarship> {}
