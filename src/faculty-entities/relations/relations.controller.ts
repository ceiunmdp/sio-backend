import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { DeleteById } from 'src/common/decorators/methods/delete-by-id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { Connection } from 'typeorm';
import { CustomError } from './../../common/classes/custom-error.class';
import { ALL_ROLES } from './../../common/constants/all-roles';
import { Auth } from './../../common/decorators/auth.decorator';
import { Filter } from './../../common/decorators/filter.decorator';
import { Id } from './../../common/decorators/id.decorator';
import { GetById } from './../../common/decorators/methods/get-by-id.decorator';
import { PatchById } from './../../common/decorators/methods/patch-by-id.decorator';
import { PostAll } from './../../common/decorators/methods/post-all.decorator';
import { PutById } from './../../common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from './../../common/decorators/pagination.decorator';
import { Sort } from './../../common/decorators/sort.decorator';
import { UserRole } from './../../common/enums/user-role.enum';
import { CrudService } from './../../common/interfaces/crud-service.interface';
import { Order } from './../../common/interfaces/order.type';
import { Where } from './../../common/interfaces/where.type';
import { ProxyCrudService } from './../../common/services/proxy-crud.service';
import { AppConfigService } from './../../config/app/app-config.service';
import { CreateRelationDto } from './dtos/create-relation.dto';
import { PartialUpdateRelationDto } from './dtos/partial-update-relation.dto';
import { ResponseRelationDto } from './dtos/response-relation.dto';
import { UpdateRelationDto } from './dtos/update-relation.dto';
import { Relation } from './entities/relation.entity';
import { RelationsService } from './relations.service';

@ApiTags(Collection.RELATIONS)
@Controller()
export class RelationsController {
  private readonly relationsService: CrudService<Relation>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    relationsService: RelationsService,
  ) {
    this.relationsService = new ProxyCrudService(connection, relationsService);
  }

  @GetAll(Collection.RELATIONS, ResponseRelationDto)
  @Auth(...ALL_ROLES)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<Relation>) {
    return this.relationsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.RELATIONS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.RELATIONS, ResponseRelationDto)
  @Auth(...ALL_ROLES)
  async findOne(@Id() id: string) {
    return this.relationsService.findOne(id);
  }

  @PostAll(Collection.RELATIONS, ResponseRelationDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another relation', type: CustomError })
  async create(@Body() createRelationDto: CreateRelationDto) {
    return this.relationsService.create(createRelationDto);
  }

  @PutById(Collection.RELATIONS, ResponseRelationDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another relation.', type: CustomError })
  async update(@Id() id: string, @Body() updateRelationDto: UpdateRelationDto) {
    return this.relationsService.update(id, updateRelationDto);
  }

  @PatchById(Collection.RELATIONS, ResponseRelationDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another relation.', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateRelationDto: PartialUpdateRelationDto) {
    return this.relationsService.update(id, partialUpdateRelationDto);
  }

  @DeleteById(Collection.RELATIONS)
  @Auth(UserRole.ADMIN)
  async remove(@Id() id: string) {
    return this.relationsService.remove(id, { softRemove: false });
  }
}
