import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { ALL_ROLES } from 'src/common/constants/all-roles.constant';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Connection } from 'typeorm';
import { ResponseFunctionalityDto } from './dtos/response-functionality.dto';
import { MenuService } from './menu.service';

@ApiTags(Collection.MENU)
@Controller()
export class MenuController {
  constructor(@InjectConnection() private readonly connection: Connection, private readonly menuService: MenuService) {}

  @Get()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseFunctionalityDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Menu.', type: ResponseFunctionalityDto })
  async find(@User('role') userRole: UserRole) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.menuService.find(userRole, manager);
    });
  }
}
