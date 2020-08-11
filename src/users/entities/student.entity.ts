import { ChildEntity, Column } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
// @TableInheritance({ column: { type: 'enum', enum: StudentType, name: 'student_type' } })
export class Student extends User {
  @Column()
  balance!: number;

  @Column()
  dni!: string;
}
