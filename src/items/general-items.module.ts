import { Module } from '@nestjs/common';
import { BindingsModule } from './bindings/bindings.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [ItemsModule, BindingsModule],
  exports: [ItemsModule, BindingsModule],
})
export class GeneralItemsModule {}
