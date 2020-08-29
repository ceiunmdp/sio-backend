import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService extends GenericSubUserService<Admin> {
  constructor(usersService: UsersService) {
    super(usersService, Admin);
  }
}
