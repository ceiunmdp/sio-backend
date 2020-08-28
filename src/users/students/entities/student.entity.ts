import { AutoMap } from 'nestjsx-automapper';
import { Movement } from 'src/movements/entities/movement.entity';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from '../../firebase-users/entities/user.entity';

@ChildEntity()
export class Student extends User {
  @Column({ default: 0 })
  balance!: number;

  @Column()
  dni!: string;

  @AutoMap(() => Movement)
  @OneToMany(() => Movement, (movement) => movement.sourceStudent || movement.targetStudent)
  readonly movements!: Movement[];

  constructor(partial: Partial<Student>) {
    super(partial);
    Object.assign(this, partial);
  }
}
