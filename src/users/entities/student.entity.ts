import { ChildEntity, Column, TableInheritance } from 'typeorm';
import { User } from './user.entity';
import { StudentType } from '../enums/student-type';

@ChildEntity()
@TableInheritance({ column: { type: 'enum', enum: StudentType, name: 'type' } })
export class Student extends User {
  @Column()
  balance!: number;

  @Column()
  dni!: string;
}
