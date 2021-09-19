import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from 'src/common/guards/guards.module';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { PrintersModule } from 'src/printers/printers.module';
import { CampusUsersModule } from 'src/users/campus-users/campus-users.module';
import { OrdersModule } from '../orders/orders.module';
import { Configuration } from './entities/configuration.entity';
import { FileState } from './entities/file-state.entity';
import { OrderFile } from './entities/order-file.entity';
import { OrderFilesController } from './order-files.controller';
import { OrderFilesService } from './order-files.service';
//! Profiles
import './profiles/order-file.profile';

@Module({
  imports: [
    AppConfigModule,
    CampusUsersModule,
    GuardsModule,
    forwardRef(() => OrdersModule),
    PrintersModule,
    TypeOrmModule.forFeature([OrderFile, FileState, Configuration]),
  ],
  providers: [OrderFilesService],
  // providers: [OrderFilesService, OrderFilesGateway],
  controllers: [OrderFilesController],
  exports: [OrderFilesService],
})
export class OrderFilesModule {}
