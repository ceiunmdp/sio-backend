import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('relations')
export class Relation extends BaseEntity {
  @Index('name-idx', { unique: true })
  @Column()
  name!: string;

  constructor(partial: Partial<Relation>) {
    super();
    Object.assign(this, partial);
  }
}
