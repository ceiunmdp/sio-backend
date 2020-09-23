import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { OrderFile } from 'src/orders/entities/order-file.entity';
import { User } from 'src/users/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { FileType } from '../enums/file-type.enum';

@Entity('files')
@Index('IX_files_delete_date', ['deleteDate'])
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
  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @RelationId((file: File) => file.course)
  readonly courseId!: string;

  @AutoMap(() => Course)
  @ManyToOne(() => Course, { eager: true }) //* Could be null for temporary files
  @JoinColumn({ name: 'course_id' })
  readonly course!: Course;

  @AutoMap(() => OrderFile)
  @OneToMany(() => OrderFile, (orderFile) => orderFile.file)
  readonly orderFiles!: OrderFile[];

  @Index('IX_files_type')
  @Column({ type: 'enum', enum: FileType, update: false })
  readonly type!: FileType;

  @Column({ name: 'physically_erased', default: false })
  physicallyErased!: boolean;

  constructor(partial: Partial<File>) {
    super(partial);
    Object.assign(this, partial);
  }
}
