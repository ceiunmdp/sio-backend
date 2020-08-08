import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/classes/base-entity.class';
import { Role } from 'src/users/entities/role.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity('functionalities')
@Tree('closure-table')
export class Functionality extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @AutoMap(() => Functionality)
  @TreeParent()
  supraFunctionality?: Functionality;

  @AutoMap(() => Functionality)
  @TreeChildren({ cascade: true })
  subFunctionalities?: Functionality[];

  @AutoMap(() => Role)
  @ManyToMany(() => Role, (role) => role.functionalities, { lazy: true, cascade: ['insert', 'update', 'remove'] })
  @JoinTable({
    name: 'functionalities_roles',
    joinColumn: { name: 'functionality_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles?: Role[];

  constructor(partial: Partial<Functionality>) {
    super();
    Object.assign(this, partial);
  }
}
