import { Body, Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm-transactional-cls-hooked';
import { CampusUsersService } from './campus-users.service';
import { CreateCampusUserDto } from './dto/create-campus-user.dto';
import { PartialUpdateCampusUserDto } from './dto/partial-update-campus-user.dto';
import { ResponseCampusUserDto } from './dto/response-campus-user.dto';
import { UpdateCampusUserDto } from './dto/update-campus-user.dto';

@ApiTags('Campus Users')
@Controller()
export class CampusUsersController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    private readonly campusUsersService: CampusUsersService,
  ) {}

  @Get()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseCampusUserDto)
  @ApiOkResponse({ description: 'List of campus users.', type: ResponseCampusUserDto })
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.campusUsersService.findAll(
        {
          limit,
          page,
          route: `${this.appConfigService.basePath}${Path.USERS}${Path.CAMPUS_USERS}`,
        },
        manager,
      );
    });
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseCampusUserDto)
  @ApiOkResponse({ description: 'Campus user', type: ResponseCampusUserDto })
  async findById(@Id() id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.campusUsersService.findById(id, manager);
    });
  }

  @Post()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseCampusUserDto)
  @ApiCreatedResponse({ description: 'The campus user has been successfully created.', type: ResponseCampusUserDto })
  async create(@Body() createCampusUserDto: CreateCampusUserDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.campusUsersService.create(createCampusUserDto, manager);
    });
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseCampusUserDto)
  @ApiOkResponse({ description: 'The campus user has been successfully updated.', type: ResponseCampusUserDto })
  async update(@Id() id: string, @Body() updateCampusUserDto: UpdateCampusUserDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.campusUsersService.update(id, updateCampusUserDto, manager);
    });
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseCampusUserDto)
  @ApiOkResponse({
    description: 'The campus user has been successfully partially updated.',
    type: ResponseCampusUserDto,
  })
  async partialUpdate(@Id() id: string, @Body() partialUpdateCampusUserDto: PartialUpdateCampusUserDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.campusUsersService.update(id, partialUpdateCampusUserDto, manager);
    });
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiOkResponse({ description: 'The campus user has been successfully deleted.' })
  async delete(@Id() id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.campusUsersService.delete(id, manager);
    });
  }
}
