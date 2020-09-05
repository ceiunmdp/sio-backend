import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Group } from 'src/common/classes/group.class';
import { ALL_ROLES } from 'src/common/constants/all-roles';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ResponseFunctionalityDto } from './dto/response-functionality.dto';
import { MenuService } from './menu.service';

@ApiTags('Menu')
@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseFunctionalityDto)
  @ApiOkResponse({ description: 'Menu.', type: ResponseFunctionalityDto })
  async find(@User('role') userRole: string) {
    return this.menuService.find(userRole);
  }

  @Post()
  @Auth(Group.ADMIN)
  @Mapper(ResponseFunctionalityDto)
  @ApiOkResponse({ description: 'The menu has been successfully created.', type: ResponseFunctionalityDto })
  async create() {
    return this.menuService.create();
  }

  @Delete()
  @Auth(Group.ADMIN)
  @ApiOkResponse({ description: 'The menu has been successfully deleted.' })
  async delete() {
    return this.menuService.delete();
  }
}
