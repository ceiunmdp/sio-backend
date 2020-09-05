import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { Group } from 'src/common/classes/group.class';
import { ProxyTypeOrmCrudService } from 'src/common/classes/proxy-typeorm-crud.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { DeleteById } from 'src/common/decorators/methods/delete-by-id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PostAll } from 'src/common/decorators/methods/post-all.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { CampusUsersService } from './campus-users.service';
import { CreateCampusUserDto } from './dto/create-campus-user.dto';
import { PartialUpdateCampusUserDto } from './dto/partial-update-campus-user.dto';
import { ResponseCampusUserDto } from './dto/response-campus-user.dto';
import { UpdateCampusUserDto } from './dto/update-campus-user.dto';
import { CampusUser } from './entities/campus-user.entity';

@ApiTags('Campus Users')
@Controller()
export class CampusUsersController {
  private readonly campusUsersService: TypeOrmCrudService<CampusUser>;

  constructor(
    @InjectConnection() connection: Connection,
    campusUsersService: CampusUsersService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.campusUsersService = new ProxyTypeOrmCrudService(connection, campusUsersService);
  }

  @GetAll(Collection.CAMPUS_USERS, ResponseCampusUserDto)
  @Auth(Group.ADMIN)
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.campusUsersService.findAll({
      limit,
      page,
      route: `${this.appConfigService.basePath}${Path.USERS}${Path.CAMPUS_USERS}`,
    });
  }

  @GetById(Collection.CAMPUS_USERS, ResponseCampusUserDto)
  @Auth(Group.ADMIN)
  async findById(@Id() id: string) {
    return this.campusUsersService.findById(id);
  }

  @PostAll(Collection.CAMPUS_USERS, ResponseCampusUserDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async create(@Body() createCampusUserDto: CreateCampusUserDto) {
    return this.campusUsersService.create(createCampusUserDto);
  }

  @PutById(Collection.CAMPUS_USERS, ResponseCampusUserDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async update(@Id() id: string, @Body() updateCampusUserDto: UpdateCampusUserDto) {
    return this.campusUsersService.update(id, updateCampusUserDto);
  }

  @PatchById(Collection.CAMPUS_USERS, ResponseCampusUserDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateCampusUserDto: PartialUpdateCampusUserDto) {
    return this.campusUsersService.update(id, partialUpdateCampusUserDto);
  }

  @DeleteById(Collection.CAMPUS_USERS)
  @Auth(Group.ADMIN)
  async delete(@Id() id: string) {
    return this.campusUsersService.delete(id);
  }
}
