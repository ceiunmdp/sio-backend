import { AutoMapper, fromValue, mapDefer, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseOrderFileDto } from 'src/orders/order-files/dtos/response/response-order-file.dto';
import { ResponseBindingGroupStateDto } from '../dtos/response-binding-group-state.dto';
import { ResponseBindingGroupDto } from '../dtos/response-binding-group.dto';
import { BindingGroupState } from '../entities/binding-group-state.entity';
import { BindingGroup } from '../entities/binding-group.entity';

@Profile()
export class BindingGroupProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(BindingGroupState, ResponseBindingGroupStateDto, {
      includeBase: [BaseEntity, ResponseBaseEntityDto],
    });
    this.createMapFromBindingGroupToResponseBindingGroupDto(mapper);
  }

  createMapFromBindingGroupToResponseBindingGroupDto(mapper: AutoMapper) {
    mapper
      .createMap(BindingGroup, ResponseBindingGroupDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] })
      .forMember(
        (responseBindingGroupDto) => responseBindingGroupDto.orderFiles,
        mapDefer((bindingGroup) =>
          bindingGroup.orderFiles
            ? mapWith(ResponseOrderFileDto, (bindingGroup) => bindingGroup.orderFiles)
            : fromValue(undefined),
        ),
      );
  }
}
