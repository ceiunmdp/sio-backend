import { AutoMap } from 'nestjsx-automapper';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { ChildEntity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { User } from '../../firebase-users/entities/user.entity';

@ChildEntity()
export class CampusUser extends User {
  @RelationId((campusUser: CampusUser) => campusUser.campus)
  readonly campusId!: string;

  @AutoMap(() => Campus)
  @ManyToOne(() => Campus, (campus) => campus.campusUsers) //* Could be null for the other child entities
  @JoinColumn({ name: 'campus_id' })
  readonly campus!: Campus;

  constructor(partial: Partial<CampusUser>) {
    super(partial);
    Object.assign(this, partial);
  }
}
