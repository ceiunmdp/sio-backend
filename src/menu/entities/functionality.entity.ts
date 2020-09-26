import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, JoinTable, ManyToMany, Tree, TreeChildren, TreeParent, Unique } from 'typeorm';
import { EFunctionality } from '../enums/e-functionality.enum';

@Entity('functionalities')
@Tree('closure-table')
@Unique(['name'])
@Unique(['code'])
export class Functionality extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ type: 'enum', enum: EFunctionality, update: false })
  readonly code!: EFunctionality;

  @AutoMap(() => Functionality)
  @TreeParent()
  supraFunctionality!: Functionality;

  @AutoMap(() => Functionality)
  @TreeChildren({ cascade: true })
  subFunctionalities?: Functionality[];

  @AutoMap(() => Role)
  @ManyToMany(() => Role, (role) => role.functionalities, { cascade: true }) // Default -> onDelete: "CASCADE", onUpdate: "NO ACTION"
  @JoinTable({
    name: 'functionalities_roles',
    joinColumn: { name: 'functionality_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles!: Role[];

  constructor(partial: Partial<Functionality>) {
    super(partial);
    Object.assign(this, partial);
  }
}
