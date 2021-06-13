import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponsePrinterDto } from './dtos/response-printer.dto';
import { PrintersService } from './printers.service';

@ApiTags(Collection.PRINTERS)
@Controller()
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @GetAll(Collection.PRINTERS, ResponsePrinterDto, '', { withoutPagination: true })
  @Auth(UserRole.ADMIN, UserRole.CAMPUS)
  findAll() {
    return this.printersService.findAll();
  }

  @GetById(Collection.PRINTERS, ResponsePrinterDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS)
  findOne(@Id() id: string) {
    return this.printersService.findOne(id);
  }
}
