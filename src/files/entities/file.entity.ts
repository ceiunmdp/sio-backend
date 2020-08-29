import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { User } from 'src/users/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { FileType } from '../enums/file-type.enum';

@Entity('files')
export class File extends BaseEntity {
  @Column()
  name!: string;

  @Column({ update: false })
  readonly extension!: string;

  @Column({ name: 'number_of_sheets', update: false })
  readonly numberOfSheets!: number;

  @Column()
  readonly size!: number; //* Bytes (max 2 GB due to INT representation)

  @AutoMap(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @AutoMap(() => Course)
  @ManyToOne(() => Course) //* Could be null for temporary files
  @JoinColumn({ name: 'course_id' })
  readonly course!: Course;

  @AutoMap(() => String)
  @Index('IX_files_type')
  @Column({ type: 'enum', enum: FileType, update: false })
  readonly type!: FileType;

  @Column({ name: 'physically_erased', default: false })
  physicallyErased: boolean;

  constructor(partial: Partial<File>) {
    super(partial);
    Object.assign(this, partial);
  }
}
