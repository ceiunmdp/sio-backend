import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { ALL_ROLES } from 'src/common/constants/all-roles';
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
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { CampusService } from './campus.service';
import { CreateCampusDto } from './dtos/create-campus.dto';
import { PartialUpdateCampusDto } from './dtos/partial-update-campus.dto';
import { ResponseCampusDto } from './dtos/response-campus.dto';
import { UpdateCampusDto } from './dtos/update-campus.dto';
import { Campus } from './entities/campus.entity';

@ApiTags('Campus')
@Controller()
export class CampusController {
  private readonly campusService: CrudService<Campus>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    campusService: CampusService,
  ) {
    this.campusService = new ProxyCrudService(connection, campusService);
  }

  @GetAll(Collection.CAMPUS, ResponseCampusDto)
  @Auth(...ALL_ROLES)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<Campus>) {
    return this.campusService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.CAMPUS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.CAMPUS, ResponseCampusDto)
  @Auth(...ALL_ROLES)
  async findById(@Id() id: string) {
    return this.campusService.findById(id);
  }

  @PostAll(Collection.CAMPUS, ResponseCampusDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another campus', type: CustomError })
  async create(@Body() createCampusDto: CreateCampusDto) {
    return this.campusService.create(createCampusDto);
  }

  @PutById(Collection.CAMPUS, ResponseCampusDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another campus.', type: CustomError })
  async update(@Id() id: string, @Body() updateCampusDto: UpdateCampusDto) {
    return this.campusService.update(id, updateCampusDto);
  }

  @PatchById(Collection.CAMPUS, ResponseCampusDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another user.', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateCampusDto: PartialUpdateCampusDto) {
    return this.campusService.update(id, partialUpdateCampusDto);
  }

  @DeleteById(Collection.CAMPUS)
  @Auth(UserRole.ADMIN)
  async delete(@Id() id: string) {
    return this.campusService.delete(id, { softRemove: true });
  }
}
