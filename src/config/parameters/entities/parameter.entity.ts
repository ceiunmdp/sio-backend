import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';
import { ParameterType } from '../enums/parameter-type.enum';

@Entity('parameters')
@Unique(['name'])
@Unique(['code'])
export class Parameter extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ type: 'enum', enum: ParameterType, update: false })
  readonly code!: ParameterType;

  @Column()
  value!: string;

  constructor(partial: Partial<Parameter>) {
    super(partial);
    Object.assign(this, partial);
  }
}
