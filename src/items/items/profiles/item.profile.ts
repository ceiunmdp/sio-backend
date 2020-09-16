import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { BindingProfile } from 'src/items/bindings/profiles/binding.profile';
import { ResponseItemDto } from '../dtos/response-item.dto';
import { Item } from '../entities/item.entity';

@Profile()
export class ItemProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Item, ResponseItemDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] });

    //! Important: BindingProfile must be imported after the item map has been created
    mapper.addProfile(BindingProfile);
  }
}
