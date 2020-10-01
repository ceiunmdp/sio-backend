import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponsePrinterDto } from '../dtos/response-printer.dto';
import { Printer } from '../entities/printer.entity';

@Profile()
export class PrinterProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Printer, ResponsePrinterDto);
  }
}
