import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, TableInheritance, Unique } from 'typeorm';
import { ItemType } from '../enums/item-type.enum';

@Entity('items')
@TableInheritance({ column: { type: 'enum', enum: ItemType, name: 'type' } })
@Unique(['name'])
export class Item extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price!: number;

  constructor(partial: Partial<Item>) {
    super(partial);
    Object.assign(this, partial);
  }
}
