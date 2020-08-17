import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { CareerCourseRelation } from 'src/faculty-entities/relations/entities/career-course-relation.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity('careers')
export class Career extends BaseEntity {
  // @Index('name-idx') //* Creates [named] index
  // @Index('name-idx', { unique: true }) //* Creates [named] UNIQUE index
  // @Column({ unique: true }) //* Creates [unnamed] UNIQUE index

  @Index('name-idx', { unique: true })
  @Column()
  name!: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.career)
  careerCourseRelations!: Promise<CareerCourseRelation[]>;

  constructor(partial: Partial<Career>) {
    super();
    Object.assign(this, partial);
  }
}
