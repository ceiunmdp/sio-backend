import { Body, Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm-transactional-cls-hooked';
import { CreateProfessorshipDto } from './dto/create-professorship.dto';
import { PartialUpdateProfessorshipDto } from './dto/partial-update-professorship.dto';
import { ResponseProfessorshipDto } from './dto/response-professorship.dto';
import { UpdateProfessorshipDto } from './dto/update-professorship.dto';
import { ProfessorshipsService } from './professorships.service';

@ApiTags('Professorships')
@Controller()
export class ProfessorshipsController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    private readonly professorshipsService: ProfessorshipsService,
  ) {}

  @Get()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseProfessorshipDto)
  @ApiOkResponse({ description: 'List of professorship users.', type: ResponseProfessorshipDto })
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.professorshipsService.findAll(
        {
          limit,
          page,
          route: `${this.appConfigService.basePath}${Path.USERS}${Path.PROFESSORSHIPS}`,
        },
        manager,
      );
    });
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseProfessorshipDto)
  @ApiOkResponse({ description: 'Professorship user', type: ResponseProfessorshipDto })
  async findById(@Id() id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.professorshipsService.findById(id, manager);
    });
  }

  @Post()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseProfessorshipDto)
  @ApiCreatedResponse({
    description: 'The professorship user has been successfully created.',
    type: ResponseProfessorshipDto,
  })
  async create(@Body() createProfessorshipDto: CreateProfessorshipDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.professorshipsService.create(createProfessorshipDto, manager);
    });
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseProfessorshipDto)
  @ApiOkResponse({
    description: 'The professorship user has been successfully updated.',
    type: ResponseProfessorshipDto,
  })
  async update(@Id() id: string, @Body() updateProfessorshipDto: UpdateProfessorshipDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.professorshipsService.update(id, updateProfessorshipDto, manager);
    });
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseProfessorshipDto)
  @ApiOkResponse({
    description: 'The professorship user has been successfully partially updated.',
    type: ResponseProfessorshipDto,
  })
  async partialUpdate(@Id() id: string, @Body() partialUpdateProfessorshipDto: PartialUpdateProfessorshipDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.professorshipsService.update(id, partialUpdateProfessorshipDto, manager);
    });
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiOkResponse({ description: 'The professorship user has been successfully deleted.' })
  async delete(@Id() id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.professorshipsService.delete(id, manager);
    });
  }
}
