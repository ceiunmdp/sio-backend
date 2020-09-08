import { ChildEntity, Column } from 'typeorm';
import { Item } from '../../items/entities/item.entity';

@ChildEntity()
export class Binding extends Item {
  @Column({ name: 'sheets_limit' })
  sheetsLimit: number;

  constructor(partial: Partial<Binding>) {
    super(partial);
    Object.assign(this, partial);
  }
}
