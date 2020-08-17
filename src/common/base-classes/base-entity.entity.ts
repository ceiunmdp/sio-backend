import { AutoMap } from 'nestjsx-automapper';
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @CreateDateColumn({ name: 'create_date', update: false })
  readonly createDate!: Date;

  @UpdateDateColumn({ name: 'update_date' })
  readonly updateDate!: Date;

  @DeleteDateColumn({ name: 'delete_date' })
  readonly deleteDate?: Date;

  @VersionColumn()
  readonly version!: number;
}
