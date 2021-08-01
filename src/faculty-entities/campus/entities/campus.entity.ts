import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { CampusUser } from 'src/users/campus-users/entities/campus-user.entity';
import { Column, Entity, OneToOne, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Campus extends BaseEntity {
  @Column()
  name!: string;

  @AutoMap(() => CampusUser)
  @OneToOne(() => CampusUser, (campusUser) => campusUser.campus)
  readonly campusUser!: CampusUser;

  constructor(partial: Partial<Campus>) {
    super(partial);
    Object.assign(this, partial);
  }
}
