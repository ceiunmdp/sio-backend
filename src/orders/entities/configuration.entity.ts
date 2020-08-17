import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { IsIn } from 'class-validator';

@Entity('configurations')
export class Configuration extends BaseEntity {
  @Column({ name: 'double_sided', update: false, default: true })
  readonly doubleSided!: boolean;

  @Column({ name: 'slides_per_sheet', update: false, default: 1 })
  // TODO: Define which configurations of this property will be available in front-end
  @IsIn([1, 2, 4, 6])
  readonly slidesPerSheet!: number;

  @Column({ update: false, default: false })
  readonly colour!: boolean;

  constructor(partial: Partial<Configuration>) {
    super();
    Object.assign(this, partial);
  }
}
