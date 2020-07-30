import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Career {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;
}
