import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'create_date' })
  createDate!: Date;

  @UpdateDateColumn({ name: 'update_date' })
  updateDate!: Date;

  @DeleteDateColumn({ name: 'delete_date' })
  deleteDate?: Date;

  @VersionColumn()
  version!: number;
}
