import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity('relations')
@Unique(['name'])
export class Relation extends BaseEntity {
  @Column()
  name!: string;

  constructor(partial: Partial<Relation>) {
    super();
    Object.assign(this, partial);
  }
}
