import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Group } from 'src/common/classes/group.class';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Path } from 'src/common/enums/path.enum';
import { AppConfigService } from 'src/config/app/app-config.service';
import { CareersService } from './careers.service';
import { CreateCareerDto } from './dtos/create-career.dto';
import { ResponseCareerDto } from './dtos/response-career.dto';
import { UpdateCareerDto } from './dtos/update-career.dto';

@ApiTags('Careers')
@Controller()
export class CareersController {
  constructor(private readonly appConfigService: AppConfigService, private readonly careersService: CareersService) {}

  @Get()
  @Auth(Group.ADMIN)
  @Mapper(ResponseCareerDto)
  @ApiOkResponse({ description: 'List of careers.', type: [ResponseCareerDto] })
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.careersService.findAll({
      limit,
      page,
      route: `${this.appConfigService.basePath}${Path.CAREERS}`,
    });
  }

  @Get(':id')
  @Auth(Group.ADMIN)
  @Mapper(ResponseCareerDto)
  @ApiOkResponse({ description: 'Career', type: ResponseCareerDto })
  async findById(@Id() id: string) {
    return this.careersService.findById(id);
  }

  @Post()
  @Auth(Group.ADMIN)
  @Mapper(ResponseCareerDto)
  @ApiCreatedResponse({ description: 'The career has been successfully created.', type: ResponseCareerDto })
  async create(@Body() createCareerDto: CreateCareerDto) {
    return this.careersService.create(createCareerDto);
  }

  @Put(':id')
  @Auth(Group.ADMIN)
  @Mapper(ResponseCareerDto)
  @ApiOkResponse({ description: 'The career has been successfully updated.', type: ResponseCareerDto })
  async update(@Id() id: string, @Body() updateCareerDto: UpdateCareerDto) {
    return this.careersService.update(id, updateCareerDto);
  }

  @Delete(':id')
  @Auth(Group.ADMIN)
  @ApiOkResponse({ description: 'The career has been successfully deleted.' })
  async delete(@Id() id: string) {
    return this.careersService.delete(id);
  }
}
