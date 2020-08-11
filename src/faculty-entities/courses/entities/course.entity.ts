import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/classes/base-entity.class';
import { CareerCourseRelation } from 'src/faculty-entities/relations/entities/career-course-relation.entity';
import { Professorship } from 'src/users/entities/professorship.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('courses')
export class Course extends BaseEntity {
  // @PrimaryGeneratedColumn('uuid')
  // id!: string;

  @Column({ unique: true })
  name!: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.course)
  careerCourseRelations!: Promise<CareerCourseRelation[]>;

  @AutoMap(() => Professorship)
  @OneToMany(() => Professorship, (professorship) => professorship.course)
  professorships!: Promise<Professorship[]>;

  constructor(partial: Partial<Course>) {
    super();
    Object.assign(this, partial);
  }
}
