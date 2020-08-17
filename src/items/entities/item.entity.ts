import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Index, TableInheritance } from 'typeorm';
import { ItemType } from '../enums/item-type.enum';

@Entity('items')
@TableInheritance({ column: { type: 'enum', enum: ItemType, name: 'type' } })
export class Item extends BaseEntity {
  @Index('name-idx', { unique: true })
  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price!: number;

  constructor(partial: Partial<Item>) {
    super();
    Object.assign(this, partial);
  }
}
