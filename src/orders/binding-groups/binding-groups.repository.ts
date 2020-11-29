import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { BindingGroup } from './entities/binding-group.entity';

@EntityRepository(BindingGroup)
export class BindingGroupsRepository extends BaseRepository<BindingGroup> {}
