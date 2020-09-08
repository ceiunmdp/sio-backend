import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { Group } from 'src/common/classes/group.class';
import { ProxyCrudService } from 'src/common/classes/proxy-crud.service';
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
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { BindingsService } from './bindings.service';
import { CreateBindingDto } from './dtos/create-binding.dto';
import { PartialUpdateBindingDto } from './dtos/partial-update-binding.dto';
import { ResponseBindingDto } from './dtos/response-binding.dto';
import { UpdateBindingDto } from './dtos/update-binding.dto';
import { Binding } from './entities/binding.entity';

@ApiTags('Bindings')
@Controller()
export class BindingsController {
  private readonly bindingsService: CrudService<Binding>;

  constructor(
    @InjectConnection() connection: Connection,
    bindingsService: BindingsService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.bindingsService = new ProxyCrudService(connection, bindingsService);
  }

  @GetAll(Collection.BINDINGS, ResponseBindingDto)
  @Auth(Group.ADMIN, Group.STUDENT, Group.SCHOLARSHIP)
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.bindingsService.findAll({
      limit,
      page,
      route: `${this.appConfigService.basePath}${Path.ITEMS}${Path.BINDINGS}`,
    });
  }

  @GetById(Collection.BINDINGS, ResponseBindingDto)
  @Auth(Group.ADMIN, Group.STUDENT, Group.SCHOLARSHIP)
  async findById(@Id() id: string) {
    return this.bindingsService.findById(id);
  }

  @PostAll(Collection.BINDINGS, ResponseBindingDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another item', type: CustomError })
  async create(@Body() createBindingDto: CreateBindingDto) {
    return this.bindingsService.create(createBindingDto);
  }

  @PutById(Collection.BINDINGS, ResponseBindingDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another item.', type: CustomError })
  async update(@Id() id: string, @Body() updateBindingDto: UpdateBindingDto) {
    return this.bindingsService.update(id, updateBindingDto);
  }

  @PatchById(Collection.BINDINGS, ResponseBindingDto)
  @Auth(Group.ADMIN)
  async partialUpdate(@Id() id: string, @Body() partialUpdateBindingDto: PartialUpdateBindingDto) {
    return this.bindingsService.update(id, partialUpdateBindingDto);
  }

  @DeleteById(Collection.BINDINGS)
  @Auth(Group.ADMIN)
  async delete(@Id() id: string) {
    return this.bindingsService.delete(id, { softRemove: false });
  }
}
