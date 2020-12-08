import { AutoMapper, fromValue, mapDefer, mapFrom, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseOrderFileDto } from 'src/orders/order-files/dtos/response/response-order-file.dto';
import { ResponseBindingGroupDto } from '../dtos/response-binding-group.dto';
import { BindingGroup } from '../entities/binding-group.entity';

@Profile()
export class BindingGroupProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    this.createMapFromBindingGroupToResponseBindingGroupDto(mapper);
  }

  createMapFromBindingGroupToResponseBindingGroupDto(mapper: AutoMapper) {
    mapper
      .createMap(BindingGroup, ResponseBindingGroupDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] })
      .forMember(
        (responseBindingGroupDto) => responseBindingGroupDto.orderFile,
        mapDefer((bindingGroup) =>
          bindingGroup.orderFile
            ? mapWith(ResponseOrderFileDto, (bindingGroup) => bindingGroup.orderFile)
            : fromValue(undefined),
        ),
      )
      .forMember(
        (responseBindingGroupDto) => responseBindingGroupDto.position,
        mapFrom((bindingGroup) => bindingGroup.orderFile?.position),
      );
  }
}
