import { ChildEntity, Column } from 'typeorm';
import { Student } from './student.entity';

@ChildEntity()
export class Scholarship extends Student {
  @Column({ name: 'available_copies' })
  availableCopies!: number;

  @Column({ name: 'remaining_copies' })
  remainingCopies!: number;
}
