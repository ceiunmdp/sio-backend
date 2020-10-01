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
import { Order } from 'src/common/interfaces/order.type';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyTypeOrmCrudService } from 'src/common/services/proxy-typeorm-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { CreateProfessorshipDto } from './dtos/create-professorship.dto';
import { PartialUpdateProfessorshipDto } from './dtos/partial-update-professorship.dto';
import { ResponseProfessorshipDto } from './dtos/response-professorship.dto';
import { UpdateProfessorshipDto } from './dtos/update-professorship.dto';
import { Professorship } from './entities/professorship.entity';
import { ProfessorshipsService } from './professorships.service';

@ApiTags('Professorships')
@Controller()
export class ProfessorshipsController {
  private readonly professorshipsService: TypeOrmCrudService<Professorship>;

  constructor(
    @InjectConnection() connection: Connection,
    professorshipsService: ProfessorshipsService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.professorshipsService = new ProxyTypeOrmCrudService(connection, professorshipsService);
  }

  @GetAll(Collection.PROFESSORSHIPS, ResponseProfessorshipDto)
  @Auth(UserRole.ADMIN)
  async findAll(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<Professorship>,
  ) {
    return this.professorshipsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.USERS}${Path.PROFESSORSHIPS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.PROFESSORSHIPS, ResponseProfessorshipDto)
  @Auth(UserRole.ADMIN, UserRole.PROFESSORSHIP)
  async findOne(@Id() id: string, @User() user: UserIdentity) {
    return this.professorshipsService.findOne(id, undefined, user);
  }

  @PostAll(Collection.PROFESSORSHIPS, ResponseProfessorshipDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async create(@Body() createProfessorshipDto: CreateProfessorshipDto) {
    return this.professorshipsService.create(createProfessorshipDto);
  }

  @PutById(Collection.PROFESSORSHIPS, ResponseProfessorshipDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async update(@Id() id: string, @Body() updateProfessorshipDto: UpdateProfessorshipDto) {
    return this.professorshipsService.update(id, updateProfessorshipDto);
  }

  @PatchById(Collection.PROFESSORSHIPS, ResponseProfessorshipDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateProfessorshipDto: PartialUpdateProfessorshipDto) {
    return this.professorshipsService.update(id, partialUpdateProfessorshipDto);
  }

  @DeleteById(Collection.PROFESSORSHIPS)
  @Auth(UserRole.ADMIN)
  async remove(@Id() id: string) {
    return this.professorshipsService.remove(id);
  }
}
