import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PostAll } from 'src/common/decorators/methods/post-all.decorator';
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
import { CreateMovementDto } from './dtos/create-movement.dto';
import { ResponseMovementDto } from './dtos/response-movement.dto';
import { Movement } from './entities/movement.entity';
import { MovementsService } from './movements.service';

@ApiTags(Collection.MOVEMENTS)
@Controller()
export class MovementsController {
  private readonly movementsService: CrudService<Movement>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    movementsService: MovementsService,
  ) {
    this.movementsService = new ProxyCrudService(connection, movementsService);
  }

  @GetAll(Collection.MOVEMENTS, ResponseMovementDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<Movement>) {
    return this.movementsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.MOVEMENTS}`,
      },
      where,
      order,
    );
  }

  @GetAll(Collection.MOVEMENTS, ResponseMovementDto, Path.ME)
  @Auth(UserRole.STUDENT, UserRole.SCHOLARSHIP)
  async findAllOwn(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<Movement>,
    @User() user: UserIdentity,
  ) {
    return this.movementsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.MOVEMENTS}${Path.ME}`,
      },
      where,
      order,
      undefined,
      user,
    );
  }

  @GetById(Collection.MOVEMENTS, ResponseMovementDto)
  @Auth(UserRole.CAMPUS, UserRole.STUDENT, UserRole.SCHOLARSHIP)
  async findOne(@Id() id: string, @User() user: UserIdentity) {
    return this.movementsService.findOne(id, undefined, user);
  }

  @PostAll(Collection.MOVEMENTS, ResponseMovementDto)
  @Auth(UserRole.CAMPUS, UserRole.STUDENT, UserRole.SCHOLARSHIP)
  async create(@Body() createMovementDto: CreateMovementDto, @User() user: UserIdentity) {
    return this.movementsService.create(createMovementDto, undefined, user);
  }
}
