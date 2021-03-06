import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { RemoveOptions } from 'src/common/interfaces/remove-options.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { AppConfigService } from 'src/config/app/app-config.service';
import { FilesService } from 'src/files/files.service';
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
    private readonly appConfigService: AppConfigService,
    private readonly filesService: FilesService,
    usersService: UsersService,
  ) {
    super(usersService, Admin);
    setTimeout(this.createAdmin.bind(this), 5000, connection.manager);
  }

  async createAdmin(manager: EntityManager) {
    const adminDefaultEmail = this.appConfigService.adminDefaultEmail;

    try {
      return await this.usersService.findByEmail(adminDefaultEmail, manager);
    } catch (error) {
      if (error instanceof UserNotFoundInFirebaseException) {
        return this.create(
          {
            displayName: 'Admin',
            email: adminDefaultEmail,
            emailVerified: true,
            password: this.appConfigService.adminDefaultPassword,
          },
          manager,
        );
      } else if (error instanceof UserNotFoundInDatabaseException) {
        const adminsRepository = manager.getRepository(Admin);

        const { id } = await adminsRepository.save({
          id: error.id,
          uid: error.id,
          displayName: 'Admin',
          email: adminDefaultEmail,
        });
        const admin = await adminsRepository.findOne(id);
        return this.usersService.setRole(admin, manager);
      }
    }
  }

  protected async beforeRemove(admin: Admin, manager: EntityManager) {
    await this.filesService.unlinkFilesFromUser(admin, manager);
  }

  async remove(id: string, options: RemoveOptions, manager: EntityManager, user: UserIdentity) {
    if (id !== user.id) {
      return super.remove(id, options, manager, user);
    } else {
      throw new BadRequestException('No es posible eliminarse a s?? mismo como administrador.');
    }
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Usuario admin ${id} no encontrado.`);
  }
}
