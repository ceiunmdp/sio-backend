import { AutoMap } from 'nestjsx-automapper';
import { Movement } from 'src/movements/entities/movement.entity';
import { ChildEntity, Column, OneToMany, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ChildEntity()
@Unique(['dni'])
export class Student extends User {
  @AutoMap()
  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
  balance!: number;

  @AutoMap()
  @Column({ default: null })
  dni!: string;

  @AutoMap(() => Movement)
  @OneToMany(() => Movement, (movement) => movement.sourceStudent || movement.targetStudent)
  readonly movements!: Movement[];

  constructor(partial: Partial<Student>) {
    super(partial);
    Object.assign(this, partial);
  }
}
