import { AutoMap } from 'nestjsx-automapper';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { ChildEntity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class CampusUser extends User {
  @AutoMap(() => Campus)
  @ManyToOne(() => Campus, (campus) => campus.campusUsers)
  @JoinColumn({ name: 'campus_id' })
  campus?: Campus;
}
