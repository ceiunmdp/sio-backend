import { Body, Controller, ParseArrayPipe, Patch, Put } from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { ID_AS_UUID_V4 } from 'src/common/constants/regular-expressions.constant';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Sort } from 'src/common/decorators/sort.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { Mapper } from './../../common/decorators/mapper.decorator';
import { BaseBodyResponses } from './../../common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from './../../common/decorators/methods/responses/base-responses.decorator';
import { PartialUpdateScholarshipBulkDto } from './dtos/partial-update-scholarship-bulk.dto';
import { PartialUpdateScholarshipDto } from './dtos/partial-update-scholarship.dto';
import { ResponseScholarshipDto } from './dtos/response-scholarship.dto';
import { UpdateScholarshipBulkDto } from './dtos/update-scholarship-bulk.dto';
import { UpdateScholarshipDto } from './dtos/update-scholarship.dto';
import { Scholarship } from './entities/scholarship.entity';
import { ScholarshipsService } from './scholarships.service';

@ApiTags(Collection.SCHOLARSHIPS)
@Controller()
export class ScholarshipsController {
  private readonly scholarshipsServiceProxy: CrudService<Scholarship>;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    private readonly scholarshipsService: ScholarshipsService,
  ) {
    this.scholarshipsServiceProxy = new ProxyCrudService(connection, scholarshipsService);
  }

  @GetAll(Collection.SCHOLARSHIPS, ResponseScholarshipDto)
  @Auth(UserRole.ADMIN)
  async findAll(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<Scholarship>,
  ) {
    return this.scholarshipsServiceProxy.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.USERS}${Path.SCHOLARSHIPS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.SCHOLARSHIPS, ResponseScholarshipDto)
  @Auth(UserRole.ADMIN)
  async findOne(@Id() id: string, @User() user: UserIdentity) {
    return this.scholarshipsServiceProxy.findOne(id, undefined, user);
  }

  @PutById(Collection.SCHOLARSHIPS, ResponseScholarshipDto, ID_AS_UUID_V4)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async update(@Id() id: string, @Body() updateScholarshipDto: UpdateScholarshipDto, @User() user: UserIdentity) {
    return this.scholarshipsServiceProxy.update(id, updateScholarshipDto, undefined, user);
  }

  @Put('/bulk')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseScholarshipDto)
  @ApiBody({ description: 'List of scholarships to update.', type: [UpdateScholarshipBulkDto] })
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'The scholarships have been successfully updated.',
    type: [ResponseScholarshipDto],
  })
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async updateBulk(
    @Body(new ParseArrayPipe({ items: UpdateScholarshipBulkDto }))
    updateScholarshipsBulkDto: UpdateScholarshipBulkDto[],
    @User() user: UserIdentity,
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.scholarshipsService.updateBulk(updateScholarshipsBulkDto, manager, user);
    });
  }

  @PatchById(Collection.SCHOLARSHIPS, ResponseScholarshipDto, ID_AS_UUID_V4)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async partialUpdate(
    @Id() id: string,
    @Body() partialUpdateScholarshipDto: PartialUpdateScholarshipDto,
    @User() user: UserIdentity,
  ) {
    return this.scholarshipsServiceProxy.update(id, partialUpdateScholarshipDto, undefined, user);
  }

  @Patch('/bulk')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseScholarshipDto)
  @ApiBody({ description: 'List of scholarships to partially update.', type: [PartialUpdateScholarshipBulkDto] })
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'The scholarships have been successfully partially updated.',
    type: [ResponseScholarshipDto],
  })
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async partialUpdateBulk(
    @Body(new ParseArrayPipe({ items: PartialUpdateScholarshipBulkDto }))
    partialUpdateScholarshipsBulkDto: PartialUpdateScholarshipBulkDto[],
    @User() user: UserIdentity,
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.scholarshipsService.updateBulk(partialUpdateScholarshipsBulkDto, manager, user);
    });
  }
}
