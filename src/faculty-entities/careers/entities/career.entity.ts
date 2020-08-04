import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { UserRole } from 'src/common/enums/user-role';
import { CareerCourseRelation } from 'src/faculty-entities/relations/entities/career-course-relation.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('careers')
export class Career {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose({ groups: [UserRole.ADMIN] })
  @Index('name-idx', { unique: true })
  @Column('varchar', { nullable: false })
  name!: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.career)
  careerCourseRelations?: CareerCourseRelation[];

  @Exclude()
  @CreateDateColumn()
  created!: Date;

  @Exclude()
  @UpdateDateColumn()
  updated!: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(partial: Partial<Career>) {
    Object.assign(this, partial);
  }
}
