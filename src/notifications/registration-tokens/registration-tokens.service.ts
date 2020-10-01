import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { UsersService } from 'src/users/users/users.service';
import { DeepPartial, EntityManager } from 'typeorm';
import { PartialUpdateRegistrationTokenDto } from './dtos/partial-update-registration-token.dto';
import { RegistrationToken } from './entities/registration-token.entity';
import { RegistrationTokensRepository } from './registration-tokens.repository';

@Injectable()
export class RegistrationTokensService {
  constructor(private readonly usersService: UsersService) {}

  async findOne(userId: string, manager: EntityManager) {
    const registrationToken = await this.getRegistrationTokensRepository(manager).findOne(userId);

    if (registrationToken) {
      return registrationToken;
    } else {
      throw new NotFoundException('Registration token not found');
    }
  }

  async update(
    userId: string,
    updateRegistrationTokenDto: PartialUpdateRegistrationTokenDto,
    manager: EntityManager,
    user: UserIdentity,
  ) {
    if (userId === user.id) {
      const registrationTokensRepository = this.getRegistrationTokensRepository(manager);
      const registrationToken = await this.getRegistrationTokensRepository(manager).findOne(userId);
      if (!registrationToken) {
        return this.createRegistrationToken(userId, updateRegistrationTokenDto, manager);
      } else {
        return this.updateRegistrationToken(userId, updateRegistrationTokenDto, registrationTokensRepository);
      }
    } else {
      throw new ForbiddenException(
        'Prohibido el acceso al recurso. No es posible alterar el token de registración de otro usuario.',
      );
    }
  }

  private async createRegistrationToken(
    userId: string,
    updateRegistrationTokenDto: PartialUpdateRegistrationTokenDto,
    manager: EntityManager,
  ) {
    const registrationTokensRepository = this.getRegistrationTokensRepository(manager);

    const user = await this.usersService.findOne(userId, manager);
    return this.updateRegistrationToken(userId, { ...updateRegistrationTokenDto, user }, registrationTokensRepository);
  }

  private async updateRegistrationToken(
    userId: string,
    updateRegistrationTokenDto: DeepPartial<RegistrationToken>,
    registrationTokensRepository: RegistrationTokensRepository,
  ) {
    return registrationTokensRepository.updateAndReload(userId, updateRegistrationTokenDto);
  }

  private getRegistrationTokensRepository(manager: EntityManager) {
    return manager.getCustomRepository(RegistrationTokensRepository);
  }
}
