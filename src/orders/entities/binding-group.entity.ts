import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity } from 'typeorm';

@Entity('binding_groups')
export class BindingGroup extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, update: false })
  readonly price!: number;

  constructor(partial: Partial<BindingGroup>) {
    super(partial);
    Object.assign(this, partial);
  }
}
