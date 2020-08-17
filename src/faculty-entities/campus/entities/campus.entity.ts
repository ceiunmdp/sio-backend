import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { CampusUser } from 'src/users/entities/campus-user.entity';
import { Entity, OneToMany, Index, Column } from 'typeorm';
import { AutoMap } from 'nestjsx-automapper';

@Entity()
export class Campus extends BaseEntity {
  @Index('name-idx', { unique: true })
  @Column()
  name!: string;

  @AutoMap(() => CampusUser)
  @OneToMany(() => CampusUser, (campusUser) => campusUser.campus)
  readonly campusUsers!: Promise<CampusUser[]>;
}
