import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { FilesModule } from 'src/files/files.module';
import { BindingGroup } from './entities/binding-group.entity';
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
    FilesModule,
    TypeOrmModule.forFeature([OrderFile, FileState, Configuration, BindingGroup]),
  ],
  providers: [OrderFilesService],
  controllers: [OrderFilesController],
  exports: [OrderFilesService],
})
export class OrderFilesModule {}
