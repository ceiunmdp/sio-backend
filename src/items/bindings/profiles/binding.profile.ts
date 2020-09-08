import { AutoMapper, ProfileBase } from 'nestjsx-automapper';
import { ResponseItemDto } from 'src/items/items/dtos/response-item.dto';
import { Item } from 'src/items/items/entities/item.entity';
import { ResponseBindingDto } from '../dtos/response-binding.dto';
import { Binding } from '../entities/binding.entity';

// @Profile()
export class BindingProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Binding, ResponseBindingDto, { includeBase: [Item, ResponseItemDto] });
  }
}
