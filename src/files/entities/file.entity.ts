import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';
import { FileType } from '../enums/file-type.enum';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';

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
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  readonly owner!: Promise<User>;

  @AutoMap(() => Course)
  @ManyToOne(() => Course) //* Could be null for temporary files
  @JoinColumn({ name: 'course_id' })
  readonly course!: Promise<Course>;

  @AutoMap(() => String)
  @Index('type-idx')
  @Column({ type: 'enum', enum: FileType, update: false })
  readonly type!: FileType;

  @Column({ name: 'physically_erased', default: false })
  physicallyErased: boolean;
}
