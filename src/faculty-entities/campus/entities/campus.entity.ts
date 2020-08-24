import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { CampusUser } from 'src/users/entities/campus-user.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Campus extends BaseEntity {
  @Column()
  name!: string;

  @AutoMap(() => CampusUser)
  @OneToMany(() => CampusUser, (campusUser) => campusUser.campus)
  readonly campusUsers!: CampusUser[];
}
