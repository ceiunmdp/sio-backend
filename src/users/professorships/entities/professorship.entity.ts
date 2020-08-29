import * as bytes from 'bytes';
import { AutoMap } from 'nestjsx-automapper';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { ChildEntity, Column, JoinColumn, OneToOne, RelationId } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ChildEntity()
export class Professorship extends User {
  @Column({ name: 'available_storage', type: 'bigint', default: bytes('1GB') })
  availableStorage!: number; //* Bytes

  @Column({ name: 'storage_used', type: 'bigint', default: 0 })
  storageUsed!: number; //* Bytes

  @RelationId((professorship: Professorship) => professorship.course)
  readonly courseId!: string;

  @AutoMap(() => Course)
  @OneToOne(() => Course, (course) => course.professorship) //* Could be null for the other child entities
  @JoinColumn({ name: 'course_id' })
  readonly course!: Course;

  constructor(partial: Partial<Professorship>) {
    super(partial);
    Object.assign(this, partial);
  }

  // @BeforeUpdate()
  // checkStorageUsedContraint() {
  //   if (this.availableStorage > this.storageUsed) {
  //     throw new BadRequestException(
  //       'No es posible asignar la capacidad de almacenamiento deseada ya que el usuario ha sobrepasado la misma. Intente con un valor superior.',
  //     );
  //   }
  // }
}
