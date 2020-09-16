import { AutoMapper, convertUsing, mapDefer, mapFrom, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { DateStringConverter } from 'src/common/converters/date-string.converter';
import { ResponseUserDto } from 'src/users/users/dtos/response-user.dto';
import { ResponseMovementTypeDto } from '../dtos/response-movement-type.dto';
import { ResponseMovementDto } from '../dtos/response-movement.dto';
import { MovementType } from '../entities/movement-type.entity';
import { Movement } from '../entities/movement.entity';

@Profile()
export class MovementProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    this.createMapFromMovementToResponseMovementDto(mapper);
    mapper.createMap(MovementType, ResponseMovementTypeDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] });
  }

  createMapFromMovementToResponseMovementDto(mapper: AutoMapper) {
    mapper
      .createMap(Movement, ResponseMovementDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] })
      .forMember(
        (dest) => dest.date,
        convertUsing(new DateStringConverter(), (src) => src.createDate),
      )
      .forMember(
        (responseMovementDto) => responseMovementDto.source,
        mapDefer((movement) =>
          movement.source
            ? mapWith(ResponseUserDto, (movement) => movement.source)
            : mapFrom((movement) => ({ id: movement.sourceId })),
        ),
      )
      .forMember(
        (responseMovementDto) => responseMovementDto.target,
        mapDefer((movement) =>
          movement.target
            ? mapWith(ResponseUserDto, (movement) => movement.target)
            : mapFrom((movement) => ({ id: movement.targetId })),
        ),
      );
  }
}
