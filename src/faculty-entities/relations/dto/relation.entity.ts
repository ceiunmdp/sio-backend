import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Relation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;
}
