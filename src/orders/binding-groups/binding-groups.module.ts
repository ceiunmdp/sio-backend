import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from 'src/common/guards/guards.module';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { CampusUsersModule } from 'src/users/campus-users/campus-users.module';
import { OrderFilesModule } from '../order-files/order-files.module';
import { OrdersModule } from '../orders/orders.module';
import { BindingGroupsController } from './binding-groups.controller';
import { BindingGroupsGateway } from './binding-groups.gateway';
import { BindingGroupsService } from './binding-groups.service';
import { BindingGroupState } from './entities/binding-group-state.entity';
import { BindingGroup } from './entities/binding-group.entity';
//! Profiles
import './profiles/binding-group.profile';

@Module({
  imports: [
    AppConfigModule,
    CampusUsersModule,
    GuardsModule,
    forwardRef(() => OrdersModule),
    OrderFilesModule,
    TypeOrmModule.forFeature([BindingGroup, BindingGroupState]),
  ],
  providers: [BindingGroupsService, BindingGroupsGateway],
  controllers: [BindingGroupsController],
  exports: [BindingGroupsService],
})
export class BindingGroupsModule {}
