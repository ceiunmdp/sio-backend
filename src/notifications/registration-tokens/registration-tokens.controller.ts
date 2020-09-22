import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { ALL_ROLES } from 'src/common/constants/all-roles';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Connection, EntityManager } from 'typeorm';
import { PartialUpdateRegistrationTokenDto } from './dtos/partial-update-registration-token.dto';
import { ResponseRegistrationTokenDto } from './dtos/response-registration-token.dto';
import { UpdateRegistrationTokenDto } from './dtos/update-registration-token.dto';
import { RegistrationTokensService } from './registration-tokens.service';

@ApiTags(Collection.REGISTRATION_TOKENS)
@Controller()
export class RegistrationTokensController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly registrationTokensService: RegistrationTokensService,
  ) {}

  @PutById(Collection.REGISTRATION_TOKENS, ResponseRegistrationTokenDto)
  @Auth(...ALL_ROLES)
  async update(
    @Id() id: string,
    @User() user: UserIdentity,
    @Body() updateRegistrationTokenDto: UpdateRegistrationTokenDto,
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.registrationTokensService.update(id, updateRegistrationTokenDto, manager, user);
    });
  }

  @PatchById(Collection.REGISTRATION_TOKENS, ResponseRegistrationTokenDto)
  @Auth(...ALL_ROLES)
  async partialUpdate(
    @Id() id: string,
    @User() user: UserIdentity,
    @Body() partialUpdateRegistrationTokenDto: PartialUpdateRegistrationTokenDto,
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.registrationTokensService.update(id, partialUpdateRegistrationTokenDto, manager, user);
    });
  }
}
