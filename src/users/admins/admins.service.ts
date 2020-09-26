import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { Connection, EntityManager } from 'typeorm';
import { UserNotFoundInDatabaseException } from '../users/exceptions/user-not-found-in-database.exception';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService extends GenericSubUserService<Admin> {
  // TODO: remove 'connection' and 'rolesService' in production
  constructor(
    @InjectConnection() connection: Connection,
    private readonly rolesService: RolesService,
    usersService: UsersService,
  ) {
    super(usersService, Admin);
    setTimeout(this.createAdmin.bind(this), 5000, connection.manager);
  }

  // TODO: Delete this method in production
  async createAdmin(manager: EntityManager) {
    try {
      return await this.usersService.findByEmail('admin@gmail.com', manager);
    } catch (error) {
      if (error instanceof UserNotFoundInDatabaseException) {
        const adminsRepository = manager.getRepository(Admin);

        const { id } = await adminsRepository.save({
          uid: error.id,
          displayName: 'Admin',
          // roles: [await this.rolesService.findByCode(UserRole.ADMIN, manager)],
        });
        const admin = await adminsRepository.findOne(id);
        return this.usersService.setRole(admin, manager);
      }
    }
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Usuario admin ${id} no encontrado.`);
  }
}
