import { Order } from '../entities/order.entity';

export const isOrderFromStudent = (userId: string, order: Order) => userId === order.studentId;
