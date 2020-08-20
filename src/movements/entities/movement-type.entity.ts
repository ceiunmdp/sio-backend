import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('movement_types')
export class MovementType extends BaseEntity {
  @Index('name-idx', { unique: true })
  @Column({ update: false })
  readonly name!: string;

  constructor(partial: Partial<MovementType>) {
    super();
    Object.assign(this, partial);
  }
}
