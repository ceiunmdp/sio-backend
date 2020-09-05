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
import { CreateProfessorshipDto } from './dto/create-professorship.dto';
import { PartialUpdateProfessorshipDto } from './dto/partial-update-professorship.dto';
import { ResponseProfessorshipDto } from './dto/response-professorship.dto';
import { UpdateProfessorshipDto } from './dto/update-professorship.dto';
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
  @Auth(Group.ADMIN)
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.professorshipsService.findAll({
      limit,
      page,
      route: `${this.appConfigService.basePath}${Path.USERS}${Path.PROFESSORSHIPS}`,
    });
  }

  @GetById(Collection.PROFESSORSHIPS, ResponseProfessorshipDto)
  @Auth(Group.ADMIN)
  async findById(@Id() id: string) {
    return this.professorshipsService.findById(id);
  }

  @PostAll(Collection.PROFESSORSHIPS, ResponseProfessorshipDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async create(@Body() createProfessorshipDto: CreateProfessorshipDto) {
    return this.professorshipsService.create(createProfessorshipDto);
  }

  @PutById(Collection.PROFESSORSHIPS, ResponseProfessorshipDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async update(@Id() id: string, @Body() updateProfessorshipDto: UpdateProfessorshipDto) {
    return this.professorshipsService.update(id, updateProfessorshipDto);
  }

  @PatchById(Collection.PROFESSORSHIPS, ResponseProfessorshipDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateProfessorshipDto: PartialUpdateProfessorshipDto) {
    return this.professorshipsService.update(id, partialUpdateProfessorshipDto);
  }

  @DeleteById(Collection.PROFESSORSHIPS)
  @Auth(Group.ADMIN)
  async delete(@Id() id: string) {
    return this.professorshipsService.delete(id);
  }
}
