import { Min } from 'class-validator';
import { ChildEntity, Column } from 'typeorm';
import { Item } from './item.entity';

@ChildEntity()
export class Binding extends Item {
  @Column({ name: 'sheets_limit' })
  @Min(1)
  sheetsLimit: number;

  constructor(partial: Partial<Binding>) {
    super(partial);
    Object.assign(this, partial);
  }
}
