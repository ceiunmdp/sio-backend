import { ChildEntity, Column } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@ChildEntity()
export class Scholarship extends Student {
  @Column({ name: 'available_copies' })
  availableCopies!: number;

  @Column({ name: 'remaining_copies' })
  remainingCopies!: number;

  constructor(partial: Partial<Scholarship>) {
    super(partial);
    Object.assign(this, partial);
  }
}
