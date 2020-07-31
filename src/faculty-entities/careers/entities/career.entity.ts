import { CareerCourseRelation } from 'src/faculty-entities/relations/entities/career-course-relation.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('careers')
export class Career {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('IDX_name', { unique: true })
  @Column('varchar', { nullable: false })
  name!: string;

  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.career)
  careerCourseRelations?: CareerCourseRelation[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
