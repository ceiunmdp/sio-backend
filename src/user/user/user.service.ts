import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentsService } from 'src/users/students/students.service';
import { User } from 'src/users/users/entities/user.entity';
import { UsersService } from 'src/users/users/users.service';
import { GenericSubUserService } from 'src/users/utils/generic-sub-user.service';
import { EntityManager } from 'typeorm';
import { PartialUpdateLoggedInUserDto } from './dto/partial-update-logged-in-user.dto';

@Injectable()
export class UserService extends GenericSubUserService<User> {
  constructor(usersService: UsersService, private readonly studentsService: StudentsService) {
    super(usersService, User);
  }

  async findOne(id: string, manager: EntityManager) {
    return await this.usersService.findOne(id, manager);
  }

  async update(id: string, partialUpdateLoggedInUserDto: PartialUpdateLoggedInUserDto, manager: EntityManager) {
    return this.usersService.update(id, partialUpdateLoggedInUserDto, manager);
  }

  protected throwCustomNotFoundException(id: string): void {
    throw new NotFoundException(`Usuario ${id} no encontrado.`);
  }
}
