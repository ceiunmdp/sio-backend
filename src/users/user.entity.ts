import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role';

@Entity()
export class User {
    constructor() {
        (this.id = 4),
            (this.username = 'manuucci96'),
            (this.firstName = 'Manuel'),
            (this.lastName = 'Nucci'),
            (this.password = 'password');
    }

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('text')
    username: string;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Expose()
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    // @Exclude()
    @Column('text')
    password: string;

    // @ManyToOne(
    //     type => User,
    //     user => user.role,
    // )
    // role: Role;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;
}
