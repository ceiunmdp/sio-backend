import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/auth/user-role';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Auth } from 'src/helpers/decorators/auth.decorator';
import { Id } from 'src/helpers/decorators/id.decorator';
import { Limit, Page } from 'src/helpers/decorators/pagination.decorator';
import { Paths } from 'src/routes';
import { CareersService } from './careers.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { Career } from './entities/career.entity';

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
  @ApiCreatedResponse({ description: 'The career has been successfully created', type: Career })
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
