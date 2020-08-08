import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/classes/base-entity.class';
import { CampusUser } from 'src/users/entities/campus-user.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Campus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @AutoMap(() => CampusUser)
  @OneToMany(() => CampusUser, (campusUser) => campusUser.campus)
  campusUsers?: CampusUser[];
}
