import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { DeleteById } from 'src/common/decorators/methods/delete-by-id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PostAll } from 'src/common/decorators/methods/post-all.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Sort } from 'src/common/decorators/sort.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { CampusUsersService } from './campus-users.service';
import { CreateCampusUserDto } from './dtos/create-campus-user.dto';
import { PartialUpdateCampusUserDto } from './dtos/partial-update-campus-user.dto';
import { ResponseCampusUserDto } from './dtos/response-campus-user.dto';
import { UpdateCampusUserDto } from './dtos/update-campus-user.dto';
import { CampusUser } from './entities/campus-user.entity';

@ApiTags('Campus Users')
@Controller()
export class CampusUsersController {
  private readonly campusUsersService: CrudService<CampusUser>;

  constructor(
    @InjectConnection() connection: Connection,
    campusUsersService: CampusUsersService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.campusUsersService = new ProxyCrudService(connection, campusUsersService);
  }

  @GetAll(Collection.CAMPUS_USERS, ResponseCampusUserDto)
  @Auth(UserRole.ADMIN)
  async findAll(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<CampusUser>,
  ) {
    return this.campusUsersService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.USERS}${Path.CAMPUS_USERS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.CAMPUS_USERS, ResponseCampusUserDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS)
  async findOne(@Id() id: string, @User() user: UserIdentity) {
    return this.campusUsersService.findOne(id, undefined, user);
  }

  @PostAll(Collection.CAMPUS_USERS, ResponseCampusUserDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async create(@Body() createCampusUserDto: CreateCampusUserDto) {
    return this.campusUsersService.create(createCampusUserDto);
  }

  @PutById(Collection.CAMPUS_USERS, ResponseCampusUserDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async update(@Id() id: string, @Body() updateCampusUserDto: UpdateCampusUserDto, @User() user: UserIdentity) {
    return this.campusUsersService.update(id, updateCampusUserDto, undefined, user);
  }

  @PatchById(Collection.CAMPUS_USERS, ResponseCampusUserDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async partialUpdate(
    @Id() id: string,
    @Body() partialUpdateCampusUserDto: PartialUpdateCampusUserDto,
    @User() user: UserIdentity,
  ) {
    return this.campusUsersService.update(id, partialUpdateCampusUserDto, undefined, user);
  }

  @DeleteById(Collection.CAMPUS_USERS)
  @Auth(UserRole.ADMIN)
  async remove(@Id() id: string, @User() user: UserIdentity) {
    return this.campusUsersService.remove(id, { softRemove: false }, undefined, user);
  }
}
