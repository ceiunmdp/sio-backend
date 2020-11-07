import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, TableInheritance, Unique } from 'typeorm';
import { EItem } from '../enums/e-item.enum';
import { ItemType } from '../enums/item-type.enum';

@Entity('items')
@TableInheritance({ column: { type: 'enum', enum: ItemType, name: 'type' } })
@Unique(['name'])
@Unique(['code'])
export class Item extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'enum', enum: EItem, update: false, nullable: true })
  readonly code?: EItem;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price!: number;

  @Column({ type: 'enum', enum: ItemType, update: false })
  readonly type!: ItemType;

  constructor(partial: Partial<Item>) {
    super(partial);
    Object.assign(this, partial);
  }
}
