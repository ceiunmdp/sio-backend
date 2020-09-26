import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { SharedModule } from 'src/shared/shared.module';
import { ItemsModule } from '../items/items.module';
import { BindingsController } from './bindings.controller';
import { BindingsService } from './bindings.service';
import { Binding } from './entities/binding.entity';

@Module({
  imports: [SharedModule, AppConfigModule, ItemsModule, TypeOrmModule.forFeature([Binding])],
  controllers: [BindingsController],
  providers: [BindingsService],
})
export class BindingsModule {}