import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/classes/base-entity.class';
import { CareerCourseRelation } from 'src/faculty-entities/relations/entities/career-course-relation.entity';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('careers')
export class Career extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('name-idx', { unique: true })
  @Column()
  name!: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.career)
  careerCourseRelations?: CareerCourseRelation[];

  constructor(partial: Partial<Career>) {
    super();
    Object.assign(this, partial);
  }
}
