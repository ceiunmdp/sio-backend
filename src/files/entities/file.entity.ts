import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { User } from 'src/users/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, RelationId } from 'typeorm';
import { FileType } from '../enums/file-type.enum';

@Entity('files')
@Index('IX_files_delete_date', ['deleteDate'])
@Index('IX_files_type', ['type'])
export class File extends BaseEntity {
  @Column()
  name!: string;

  @Column({ update: false })
  readonly mimetype!: string;

  @Column({ name: 'number_of_sheets', update: false })
  readonly numberOfSheets!: number;

  @Column({ update: false })
  readonly size!: number; //* Bytes (max 2 GB due to INT representation)

  @Column()
  path!: string;

  @RelationId((file: File) => file.owner)
  readonly ownerId?: string;

  @AutoMap(() => User)
  @ManyToOne(() => User) //* Could be null for system professorship files without professorship
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @AutoMap(() => Course)
  @ManyToMany(() => Course) //* Could be null for temporary files
  @JoinTable({
    name: 'courses_files',
    joinColumn: { name: 'file_id' },
    inverseJoinColumn: { name: 'course_id' },
  })
  courses!: Course[]; //* Only SystemStaff files can alter its related courses

  @Column({ type: 'enum', enum: FileType, update: false })
  readonly type!: FileType;

  @Column({ name: 'physically_erased', default: false })
  physicallyErased!: boolean;

  constructor(partial: Partial<File>) {
    super(partial);
    Object.assign(this, partial);
  }
}
