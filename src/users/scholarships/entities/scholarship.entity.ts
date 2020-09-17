import { ChildEntity, Column } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@ChildEntity()
export class Scholarship extends Student {
  @Column({ name: 'available_copies', default: null })
  availableCopies!: number;

  @Column({ name: 'remaining_copies', default: null })
  remainingCopies!: number;

  constructor(partial: Partial<Scholarship>) {
    super(partial);
    Object.assign(this, partial);
  }
}
