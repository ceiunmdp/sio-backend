import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';
import { EMovementType } from '../enums/e-movement-type.enum';

@Entity('movement_types')
@Unique(['name'])
@Unique(['code'])
export class MovementType extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ update: false })
  readonly code!: EMovementType;

  constructor(partial: Partial<MovementType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
