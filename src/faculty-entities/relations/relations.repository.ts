import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Relation } from './entities/relation.entity';

@EntityRepository(Relation)
export class RelationsRepository extends BaseRepository<Relation> {}
