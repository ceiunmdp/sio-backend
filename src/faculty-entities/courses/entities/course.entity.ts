import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { CareerCourseRelation } from 'src/faculty-entities/relations/entities/career-course-relation.entity';
import { Professorship } from 'src/users/entities/professorship.entity';
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';

@Entity('courses')
export class Course extends BaseEntity {
  @Index('name-idx', { unique: true })
  @Column()
  name!: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.course)
  careerCourseRelations!: CareerCourseRelation[];

  @AutoMap(() => Professorship)
  @OneToOne(() => Professorship, (professorship) => professorship.course)
  readonly professorship!: Professorship;

  constructor(partial: Partial<Course>) {
    super();
    Object.assign(this, partial);
  }
}
