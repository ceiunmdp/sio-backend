import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseBodyResponses } from 'src/common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AdminsService } from 'src/users/admins/admins.service';
import { ResponseAdminDto } from 'src/users/admins/dtos/response-admin.dto';
import { Admin } from 'src/users/admins/entities/admin.entity';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInAdminDto } from './dto/partial-update-logged-in-admin.dto';
import { UpdateLoggedInAdminDto } from './dto/update-logged-in-admin.dto';

@ApiTags(Collection.ADMIN)
@Controller()
export class AdminController {
  private readonly adminsService: CrudService<Admin>;

  constructor(@InjectConnection() connection: Connection, adminsService: AdminsService) {
    this.adminsService = new ProxyCrudService(connection, adminsService);
  }

  @Get()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseAdminDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in admin', type: ResponseAdminDto })
  async findOne(@User('id') id: string) {
    return this.adminsService.findOne(id, undefined);
  }

  @Put()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseAdminDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently logged in admin updated successfully', type: ResponseAdminDto })
  async update(@User('id') id: string, @Body() updateLoggedInAdminDto: UpdateLoggedInAdminDto) {
    return this.adminsService.update(id, updateLoggedInAdminDto, undefined);
  }

  @Patch()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseAdminDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in admin partially updated successfully',
    type: ResponseAdminDto,
  })
  async partialUpdate(@User('id') id: string, @Body() partialUpdateLoggedInAdminDto: PartialUpdateLoggedInAdminDto) {
    return this.adminsService.update(id, partialUpdateLoggedInAdminDto, undefined);
  }
}
