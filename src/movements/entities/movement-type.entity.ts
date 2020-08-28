import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity('movement_types')
@Unique(['name'])
export class MovementType extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  constructor(partial: Partial<MovementType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
