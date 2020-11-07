import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';
import { EFileState } from '../enums/e-file-state.enum';

@Entity('file_states')
@Unique(['name'])
@Unique(['code'])
export class FileState extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ type: 'enum', enum: EFileState, update: false })
  readonly code!: EFileState;

  constructor(partial: Partial<FileState>) {
    super(partial);
    Object.assign(this, partial);
  }
}
