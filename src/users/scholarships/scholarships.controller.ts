import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
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
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Order } from 'src/common/interfaces/order.type';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyTypeOrmCrudService } from 'src/common/services/proxy-typeorm-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { PartialUpdateScholarshipDto } from './dtos/partial-update-scholarship.dto';
import { ResponseScholarshipDto } from './dtos/response-scholarship.dto';
import { UpdateScholarshipDto } from './dtos/update-scholarship.dto';
import { Scholarship } from './entities/scholarship.entity';
import { ScholarshipsService } from './scholarships.service';

@ApiTags('Scholarships')
@Controller()
export class ScholarshipsController {
  private readonly scholarshipsService: TypeOrmCrudService<Scholarship>;

  constructor(
    @InjectConnection() connection: Connection,
    scholarshipsService: ScholarshipsService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.scholarshipsService = new ProxyTypeOrmCrudService(connection, scholarshipsService);
  }

  @GetAll(Collection.SCHOLARSHIPS, ResponseScholarshipDto)
  @Auth(UserRole.ADMIN)
  async findAll(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<Scholarship>,
  ) {
    return this.scholarshipsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.USERS}${Path.SCHOLARSHIPS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.STUDENTS, ResponseScholarshipDto)
  @Auth(UserRole.ADMIN, UserRole.SCHOLARSHIP)
  async findOne(@Id() id: string, @User() user: UserIdentity) {
    return this.scholarshipsService.findOne(id, undefined, user);
  }

  @PutById(Collection.STUDENTS, ResponseScholarshipDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async update(@Id() id: string, @Body() updateScholarshipDto: UpdateScholarshipDto) {
    return this.scholarshipsService.update(id, updateScholarshipDto);
  }

  @PatchById(Collection.STUDENTS, ResponseScholarshipDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateScholarshipDto: PartialUpdateScholarshipDto) {
    return this.scholarshipsService.update(id, partialUpdateScholarshipDto);
  }
}
