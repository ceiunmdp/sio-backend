import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseBodyResponses } from 'src/common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AdminsService } from 'src/users/admins/admins.service';
import { ResponseAdminDto } from 'src/users/admins/dtos/response-admin.dto';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInAdminDto } from './dto/partial-update-logged-in-admin.dto';
import { UpdateLoggedInAdminDto } from './dto/update-logged-in-admin.dto';

@ApiTags('Admin')
@Controller()
export class AdminController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly adminsService: AdminsService,
  ) {}

  @Get()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseAdminDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in admin', type: ResponseAdminDto })
  async findOne(@User('id') id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.adminsService.findOne(id, manager);
    });
  }

  @Put()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseAdminDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently logged in admin updated successfully', type: ResponseAdminDto })
  async update(@User('id') id: string, @Body() updateLoggedInAdminDto: UpdateLoggedInAdminDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.adminsService.update(id, updateLoggedInAdminDto, manager);
    });
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
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.adminsService.update(id, partialUpdateLoggedInAdminDto, manager);
    });
  }
}
