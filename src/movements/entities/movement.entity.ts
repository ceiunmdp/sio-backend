import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { User } from 'src/users/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { MovementType } from './movement-type.entity';

@Entity('movements')
export class Movement extends BaseEntity {
  @RelationId((movement: Movement) => movement.source)
  readonly sourceId!: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.movements, { nullable: false })
  @JoinColumn({ name: 'source_user_id' })
  readonly source!: User;

  @RelationId((movement: Movement) => movement.target)
  readonly targetId!: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.movements, { nullable: false })
  @JoinColumn({ name: 'target_user_id' })
  readonly target!: User;

  @AutoMap(() => MovementType)
  @ManyToOne(() => MovementType, { nullable: false, eager: true })
  @JoinColumn({ name: 'movement_type_id' })
  readonly type!: MovementType;

  @Column({ type: 'decimal', precision: 8, scale: 2, update: false })
  readonly amount!: number;

  //* Timestamp is already stored in BaseEntity

  constructor(partial: Partial<Movement>) {
    super(partial);
    Object.assign(this, partial);
  }
}
