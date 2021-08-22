import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from 'src/common/guards/guards.module';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { ParametersModule } from 'src/config/parameters/parameters.module';
import { FilesModule } from 'src/files/files.module';
import { BindingsModule } from 'src/items/bindings/bindings.module';
import { ItemsModule } from 'src/items/items/items.module';
import { MovementsModule } from 'src/movements/movements.module';
import { CampusUsersModule } from 'src/users/campus-users/campus-users.module';
import { ScholarshipsModule } from 'src/users/scholarships/scholarships.module';
import { StudentsModule } from 'src/users/students/students.module';
import { BindingGroupsModule } from '../binding-groups/binding-groups.module';
import { OrderFilesModule } from '../order-files/order-files.module';
import { OrderState } from './entities/order-state.entity';
import { OrderToOrderState } from './entities/order-to-order-state.entity';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';
//! Profiles
import './profiles/order.profile';

@Module({
  imports: [
    AppConfigModule,
    BindingsModule,
    forwardRef(() => BindingGroupsModule),
    CampusUsersModule,
    ItemsModule,
    FilesModule,
    GuardsModule,
    MovementsModule,
    forwardRef(() => OrderFilesModule),
    ScholarshipsModule,
    StudentsModule,
    TypeOrmModule.forFeature([Order, OrderToOrderState, OrderState]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway],
  // TODO: Remove OrdersGateway after NestJS v8 release
  exports: [OrdersService, OrdersGateway],
})
export class OrdersModule {}
