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
import { ResponseScholarshipDto } from 'src/users/scholarships/dtos/response-scholarship.dto';
import { ScholarshipsService } from 'src/users/scholarships/scholarships.service';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInScholarshipDto } from './dto/partial-update-logged-in-scholarship.dto';
import { UpdateLoggedInScholarshipDto } from './dto/update-logged-in-scholarship.dto';

@ApiTags('Scholarship')
@Controller()
export class ScholarshipController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly scholarshipsService: ScholarshipsService,
  ) {}

  @Get()
  @Auth(UserRole.SCHOLARSHIP)
  @Mapper(ResponseScholarshipDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in scholarship', type: ResponseScholarshipDto })
  async findOne(@User('id') id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.scholarshipsService.findOne(id, manager);
    });
  }

  @Put()
  @Auth(UserRole.SCHOLARSHIP)
  @Mapper(ResponseScholarshipDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in scholarship updated successfully',
    type: ResponseScholarshipDto,
  })
  async update(@User('id') id: string, @Body() updateLoggedInScholarshipDto: UpdateLoggedInScholarshipDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.scholarshipsService.update(id, updateLoggedInScholarshipDto, manager);
    });
  }

  @Patch()
  @Auth(UserRole.SCHOLARSHIP)
  @Mapper(ResponseScholarshipDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in scholarship partially updated successfully',
    type: ResponseScholarshipDto,
  })
  async partialUpdate(
    @User('id') id: string,
    @Body() partialUpdateLoggedInScholarshipDto: PartialUpdateLoggedInScholarshipDto,
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.scholarshipsService.update(id, partialUpdateLoggedInScholarshipDto, manager);
    });
  }
}
