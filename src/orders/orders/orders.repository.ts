import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Order } from './entities/order.entity';

@EntityRepository(Order)
export class OrdersRepository extends BaseRepository<Order> {}
