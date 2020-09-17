import { ChildEntity, Column, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ChildEntity()
@Unique(['dni'])
export class Student extends User {
  @Column({ type: 'decimal', precision: 6, scale: 2, default: null })
  balance!: number;

  @Column({ default: null })
  dni!: string;

  constructor(partial: Partial<Student>) {
    super(partial);
    Object.assign(this, partial);
  }
}
