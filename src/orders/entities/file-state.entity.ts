import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('file_states')
export class FileState extends BaseEntity {
  @Index('name-idx', { unique: true })
  @Column({ update: false })
  readonly name!: string;

  constructor(partial: Partial<FileState>) {
    super();
    Object.assign(this, partial);
  }
}
