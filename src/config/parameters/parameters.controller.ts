import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { ALL_ROLES } from 'src/common/constants/all-roles.constant';
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
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { Connection } from 'typeorm';
import { AppConfigService } from '../app/app-config.service';
import { PartialUpdateParameterDto } from './dtos/partial-update-parameter.dto';
import { ResponseParameterDto } from './dtos/response-parameter.dto';
import { UpdateParameterDto } from './dtos/update-parameter.dto';
import { Parameter } from './entities/parameter.entity';
import { ParametersService } from './parameters.service';

@ApiTags(Collection.PARAMETERS)
@Controller()
export class ParametersController {
  private readonly parametersService: CrudService<Parameter>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    parametersService: ParametersService,
  ) {
    this.parametersService = new ProxyCrudService(connection, parametersService);
  }

  @GetAll(Collection.PARAMETERS, ResponseParameterDto)
  @Auth(UserRole.ADMIN)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<Parameter>) {
    return this.parametersService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.PARAMETERS}`,
      },
      where,
      order,
    );
  }

  @GetAll(Collection.PARAMETERS, ResponseParameterDto, Path.ME)
  @Auth(...ALL_ROLES)
  async findAllOwn(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<File>,
    @User() user: UserIdentity,
  ) {
    return this.parametersService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.PARAMETERS}`,
      },
      where,
      order,
      undefined,
      user,
    );
  }

  @GetById(Collection.PARAMETERS, ResponseParameterDto)
  @Auth(UserRole.ADMIN)
  async findOne(@Id() id: string) {
    return this.parametersService.findOne(id);
  }

  @PutById(Collection.PARAMETERS, ResponseParameterDto)
  @Auth(UserRole.ADMIN)
  async update(@Id() id: string, @Body() updateParameterDto: UpdateParameterDto) {
    return this.parametersService.update(id, updateParameterDto);
  }

  @PatchById(Collection.PARAMETERS, ResponseParameterDto)
  @Auth(UserRole.ADMIN)
  async partialUpdate(@Id() id: string, @Body() partialUpdateParameterDto: PartialUpdateParameterDto) {
    return this.parametersService.update(id, partialUpdateParameterDto);
  }
}
