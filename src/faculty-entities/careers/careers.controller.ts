import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Paths } from 'src/common/enums/paths';
import { UserRole } from 'src/common/enums/user-role';
import { AppConfigService } from 'src/config/app/app-config.service';
import { CareersService } from './careers.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

@ApiTags('Careers')
@Controller(Paths.CAREERS)
export class CareersController {
  constructor(private readonly careersService: CareersService, private readonly appConfigService: AppConfigService) {}

  @Get()
  @Auth(UserRole.ADMIN)
  async findAll(@Page() page: number, @Limit() limit: number) {
    return this.careersService.findAll({
      page,
      limit,
      route: `${this.appConfigService.basePath}/${Paths.CAREERS}`,
    });
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  async findById(@Id() id: string) {
    return this.careersService.findById(id);
  }

  @Post()
  @Auth(UserRole.ADMIN)
  // @ApiCreatedResponse({ description: 'The career has been successfully created', type: Career })
  async create(@Body() createCareerDto: CreateCareerDto) {
    return this.careersService.create(createCareerDto);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  async update(@Id() id: string, @Body() updateCareerDto: UpdateCareerDto) {
    return this.careersService.update(id, updateCareerDto);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  async delete(@Id() id: string) {
    return this.careersService.delete(id);
  }
}
