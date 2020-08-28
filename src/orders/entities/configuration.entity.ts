import { IsIn } from 'class-validator';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity } from 'typeorm';

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
    super(partial);
    Object.assign(this, partial);
  }
}
