import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Item } from './entities/item.entity';

@EntityRepository(Item)
export class ItemsRepository extends BaseRepository<Item> {}
