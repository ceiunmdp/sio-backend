import { Query } from '@nestjs/common';
import { OrderPipe } from '../pipes/order.pipe';

export const Sort = (property = 'sort') => Query(property, OrderPipe);
