import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { CampusUser } from 'src/users/entities/campus-user.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity()
export class Campus extends BaseEntity {
  @Index('name-idx', { unique: true })
  @Column()
  name!: string;

  @AutoMap(() => CampusUser)
  @OneToMany(() => CampusUser, (campusUser) => campusUser.campus)
  readonly campusUsers!: CampusUser[];
}
