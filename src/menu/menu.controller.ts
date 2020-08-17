import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseFunctionalityDto } from './dto/response-functionality.dto';
import { MenuService } from './menu.service';

@ApiTags('Menu')
@Controller(Path.MENU)
export class MenuController {
  constructor(
    // @InjectMapper() private readonly mapper: AutoMapper,
    private readonly menuService: MenuService,
  ) {
    // this.mapper.dispose();
    // this.mapper.addProfile(FunctionalityProfile);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, UserRole.PROFESSORSHIP, UserRole.SCHOLARSHIP, UserRole.STUDENT)
  // @Mapper(ResponseFunctionalityDto)
  @ApiOkResponse({ description: 'Menu.', type: ResponseFunctionalityDto })
  async find(@User('role') userRole: string) {
    return this.menuService.find(userRole);
  }

  @Post()
  @Auth(UserRole.ADMIN)
  // @Mapper(ResponseFunctionalityDto)
  @ApiOkResponse({ description: 'The menu has been successfully created.', type: ResponseFunctionalityDto })
  async create() {
    return this.menuService.create();
  }

  @Delete()
  @Auth(UserRole.ADMIN)
  @ApiOkResponse({ description: 'The menu has been successfully deleted.' })
  async delete() {
    return this.menuService.delete();
  }
}