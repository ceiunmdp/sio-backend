import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { Group } from 'src/common/classes/group.class';
import { ProxyTypeOrmCrudService } from 'src/common/classes/proxy-typeorm-crud.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { PartialUpdateScholarshipDto } from './dto/partial-update-scholarship.dto';
import { ResponseScholarshipDto } from './dto/response-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
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
  @Auth(Group.ADMIN)
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.scholarshipsService.findAll({
      limit,
      page,
      route: `${this.appConfigService.basePath}${Path.USERS}${Path.SCHOLARSHIPS}`,
    });
  }

  @GetById(Collection.STUDENTS, ResponseScholarshipDto)
  @Auth(Group.ADMIN)
  async findById(@Id() id: string) {
    return this.scholarshipsService.findById(id);
  }

  @PutById(Collection.STUDENTS, ResponseScholarshipDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  async update(@Id() id: string, @Body() updateScholarshipDto: UpdateScholarshipDto) {
    return this.scholarshipsService.update(id, updateScholarshipDto);
  }

  @PatchById(Collection.STUDENTS, ResponseScholarshipDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateScholarshipDto: PartialUpdateScholarshipDto) {
    return this.scholarshipsService.update(id, partialUpdateScholarshipDto);
  }
}
