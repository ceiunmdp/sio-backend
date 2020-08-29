import { BadRequestException, Body, Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm-transactional-cls-hooked';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PartialUpdateAdminDto } from './dto/partial-update-admin.dto';
import { ResponseAdminDto } from './dto/response-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admins')
@Controller()
export class AdminsController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    private readonly adminsService: AdminsService,
  ) {}

  @Get()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseAdminDto)
  @ApiOkResponse({ description: 'List of admin users.', type: ResponseAdminDto })
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.adminsService.findAll(
        {
          limit,
          page,
          route: `${this.appConfigService.basePath}${Path.USERS}${Path.ADMINS}`,
        },
        manager,
      );
    });
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseAdminDto)
  @ApiOkResponse({ description: 'Admin user', type: ResponseAdminDto })
  async findById(@Id() id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.adminsService.findById(id, manager);
    });
  }

  @Post()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseAdminDto)
  @ApiCreatedResponse({ description: 'The admin user has been successfully created.', type: ResponseAdminDto })
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.adminsService.create(createAdminDto, manager);
    });
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseAdminDto)
  @ApiOkResponse({ description: 'The admin user has been successfully updated.', type: ResponseAdminDto })
  async update(@Id() id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.adminsService.update(id, updateAdminDto, manager);
    });
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseAdminDto)
  @ApiOkResponse({
    description: 'The admin user has been successfully partially updated.',
    type: ResponseAdminDto,
  })
  async partialUpdate(@Id() id: string, @Body() partialUpdateAdminDto: PartialUpdateAdminDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.adminsService.update(id, partialUpdateAdminDto, manager);
    });
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiOkResponse({ description: 'The admin user has been successfully deleted.' })
  async delete(@User('id') userId: string, @Id() id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      if (userId !== id) {
        return this.adminsService.delete(id, manager);
      } else {
        throw new BadRequestException('No es posible eliminarse a sí mismo como administrador.');
      }
    });
  }
}
