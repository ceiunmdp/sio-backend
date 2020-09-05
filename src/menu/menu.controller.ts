import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { ALL_ROLES } from 'src/common/constants/all-roles';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { Connection, EntityManager } from 'typeorm';
import { ResponseFunctionalityDto } from './dto/response-functionality.dto';
import { MenuService } from './menu.service';

@ApiTags('Menu')
@Controller()
export class MenuController {
  constructor(@InjectConnection() private readonly connection: Connection, private readonly menuService: MenuService) {}

  @Get()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseFunctionalityDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Menu.', type: ResponseFunctionalityDto })
  async find(@User('role') userRole: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.menuService.find(userRole, manager);
    });
  }
}
