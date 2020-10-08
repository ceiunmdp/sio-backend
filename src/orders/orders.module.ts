import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { BindingGroup } from './entities/binding-group.entity';
import { Configuration } from './entities/configuration.entity';
import { FileState } from './entities/file-state.entity';
import { OrderFile } from './entities/order-file.entity';
import { OrderState } from './entities/order-state.entity';
import { OrderToOrderState } from './entities/order-to-order-state.entity';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([Order, OrderFile, OrderToOrderState, OrderState, FileState, Configuration, BindingGroup]),
  ],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
