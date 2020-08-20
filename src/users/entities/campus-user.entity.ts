import { AutoMap } from 'nestjsx-automapper';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { ChildEntity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class CampusUser extends User {
  @AutoMap(() => Campus)
  @ManyToOne(() => Campus, (campus) => campus.campusUsers) //* Could be null for the other child entities
  @JoinColumn({ name: 'campus_id' })
  readonly campus!: Campus;

  constructor(partial: Partial<Campus>) {
    super(partial);
    Object.assign(this, partial);
  }
}
