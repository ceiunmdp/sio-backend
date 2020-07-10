import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './user-role';

// export type User = any;

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    private readonly users: User[];

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
        this.users = [
            {
                id: 1,
                username: 'john',
                firstName: 'John',
                lastName: 'Doe',
                fullName: 'John Doe',
                password: 'changeme',
                role: UserRole.ADMIN,
            },
            {
                id: 2,
                username: 'chris',
                firstName: 'John',
                lastName: 'Doe',
                fullName: 'John Doe',
                password: 'secret',
                role: UserRole.ADMIN,
            },
            {
                id: 3,
                username: 'maria',
                firstName: 'John',
                lastName: 'Doe',
                fullName: 'John Doe',
                password: 'guess',
                role: UserRole.ADMIN,
            },
        ];
    }

    // constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        this.logger.log('Llego');
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;

        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        this.logger.log('Find all users...');
        return this.usersRepository.find();
    }

    async findOneById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne(id);
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
