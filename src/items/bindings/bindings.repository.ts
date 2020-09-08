import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Binding } from './entities/binding.entity';

@EntityRepository(Binding)
export class BindingsRepository extends BaseRepository<Binding> {}
