import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { UsersService } from 'src/users/users/users.service';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { PartialUpdateRegistrationTokenDto } from './dtos/partial-update-registration-token.dto';
import { RegistrationToken } from './entities/registration-token.entity';

@Injectable()
export class RegistrationTokensService {
  constructor(private readonly usersService: UsersService) {}

  async findById(userId: string, manager: EntityManager) {
    const registrationTokensRepository = this.getRegistrationTokensRepository(manager);
    const registrationToken = await registrationTokensRepository.findOne(userId);

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
    const registrationTokensRepository = this.getRegistrationTokensRepository(manager);

    if (userId === user.id) {
      const registrationToken = await registrationTokensRepository.findOne(userId);
      if (!registrationToken) {
        return this.createRegistrationToken(userId, updateRegistrationTokenDto, manager);
      } else {
        return this.updateRegistrationToken(userId, updateRegistrationTokenDto, registrationTokensRepository);
      }
    } else {
      throw new ForbiddenException('Acceso denegado. No es posible alterar el token de registración de otro usuario.');
    }
  }

  private async createRegistrationToken(
    userId: string,
    updateRegistrationTokenDto: PartialUpdateRegistrationTokenDto,
    manager: EntityManager,
  ) {
    const registrationTokensRepository = this.getRegistrationTokensRepository(manager);

    const user = await this.usersService.findById(userId, manager);
    return this.updateRegistrationToken(userId, { ...updateRegistrationTokenDto, user }, registrationTokensRepository);
  }

  private async updateRegistrationToken(
    userId: string,
    updateRegistrationTokenDto: DeepPartial<RegistrationToken>,
    registrationTokensRepository: Repository<RegistrationToken>,
  ) {
    await registrationTokensRepository.save({ ...updateRegistrationTokenDto, id: userId });
    return registrationTokensRepository.findOne(userId);
  }

  private getRegistrationTokensRepository(manager: EntityManager) {
    return manager.getRepository(RegistrationToken);
  }
}
