import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { DeleteById } from 'src/common/decorators/methods/delete-by-id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Career } from 'src/faculty-entities/careers/entities/career.entity';
import { Connection } from 'typeorm';
import { CustomError } from './../../common/classes/custom-error.class';
import { ALL_ROLES } from './../../common/constants/all-roles';
import { Filter } from './../../common/decorators/filter.decorator';
import { GetById } from './../../common/decorators/methods/get-by-id.decorator';
import { PostAll } from './../../common/decorators/methods/post-all.decorator';
import { PutById } from './../../common/decorators/methods/put-by-id.decorator';
import { Sort } from './../../common/decorators/sort.decorator';
import { Order } from './../../common/interfaces/order.type';
import { Where } from './../../common/interfaces/where.type';
import { CareersService } from './careers.service';
import { CreateCareerDto } from './dtos/create-career.dto';
import { PartialUpdateCareerDto } from './dtos/partial-update-career.dto';
import { ResponseCareerDto } from './dtos/response-career.dto';
import { UpdateCareerDto } from './dtos/update-career.dto';

@ApiTags(Collection.CAREERS)
@Controller()
export class CareersController {
  private readonly careersService: CrudService<Career>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    careersService: CareersService,
  ) {
    this.careersService = new ProxyCrudService(connection, careersService);
  }

  @GetAll(Collection.CAREERS, ResponseCareerDto)
  @Auth(...ALL_ROLES)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<Career>) {
    return this.careersService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.CAREERS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.CAREERS, ResponseCareerDto)
  @Auth(...ALL_ROLES)
  async findOne(@Id() id: string) {
    return this.careersService.findOne(id);
  }

  @PostAll(Collection.CAREERS, ResponseCareerDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another career', type: CustomError })
  async create(@Body() createCareerDto: CreateCareerDto) {
    return this.careersService.create(createCareerDto);
  }

  @PutById(Collection.CAREERS, ResponseCareerDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another career.', type: CustomError })
  async update(@Id() id: string, @Body() updateCareerDto: UpdateCareerDto) {
    return this.careersService.update(id, updateCareerDto);
  }

  @PatchById(Collection.CAREERS, ResponseCareerDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another career.', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateCareerDto: PartialUpdateCareerDto) {
    return this.careersService.update(id, partialUpdateCareerDto);
  }

  @DeleteById(Collection.CAREERS)
  @Auth(UserRole.ADMIN)
  async remove(@Id() id: string) {
    return this.careersService.remove(id, { softRemove: false });
  }
}
