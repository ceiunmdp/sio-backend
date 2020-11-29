import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';
import { EBindingGroupState } from '../enums/e-binding-group-state.enum';

@Entity('binding_group_states')
@Unique(['name'])
@Unique(['code'])
export class BindingGroupState extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ type: 'enum', enum: EBindingGroupState, update: false })
  readonly code!: EBindingGroupState;

  constructor(partial: Partial<BindingGroupState>) {
    super(partial);
    Object.assign(this, partial);
  }
}
