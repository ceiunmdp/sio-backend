import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { OrderFile } from './entities/order-file.entity';

@EntityRepository(OrderFile)
export class OrderFilesRepository extends BaseRepository<OrderFile> {}
