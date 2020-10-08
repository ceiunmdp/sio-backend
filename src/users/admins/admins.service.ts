import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection, EntityManager } from 'typeorm';
import { UserNotFoundInDatabaseException } from '../users/exceptions/user-not-found-in-database.exception';
import { UserNotFoundInFirebaseException } from '../users/exceptions/user-not-found-in-firebase.exception';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService extends GenericSubUserService<Admin> {
  constructor(
    @InjectConnection() connection: Connection,
    appConfigService: AppConfigService,
    usersService: UsersService,
  ) {
    super(usersService, Admin);
    if (!appConfigService.isProduction) {
      setTimeout(this.createAdmin.bind(this), 5000, connection.manager);
    }
  }

  async createAdmin(manager: EntityManager) {
    try {
      return await this.usersService.findByEmail('admin@gmail.com', manager);
    } catch (error) {
      if (error instanceof UserNotFoundInFirebaseException) {
        return this.create(
          {
            displayName: 'Admin',
            email: 'admin@gmail.com',
            emailVerified: true,
            password: 'Password123*',
          },
          manager,
        );
      } else if (error instanceof UserNotFoundInDatabaseException) {
        const adminsRepository = manager.getRepository(Admin);

        const { id } = await adminsRepository.save({
          id: error.id,
          uid: error.id,
          displayName: 'Admin',
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
