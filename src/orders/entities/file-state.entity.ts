import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity('file_states')
@Unique(['name'])
export class FileState extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  constructor(partial: Partial<FileState>) {
    super();
    Object.assign(this, partial);
  }
}
