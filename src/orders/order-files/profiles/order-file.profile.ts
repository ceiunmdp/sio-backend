import { AutoMapper, mapDefer, mapFrom, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseFileDto } from 'src/files/dtos/response-file.dto';
import { ResponseOrderDto } from 'src/orders/orders/dtos/response/response-order.dto';
import { ResponseConfigurationDto } from '../dtos/response/response-configuration.dto';
import { ResponseFileStateDto } from '../dtos/response/response-file-state.dto';
import { ResponseOrderFileDto } from '../dtos/response/response-order-file.dto';
import { Configuration } from '../entities/configuration.entity';
import { FileState } from '../entities/file-state.entity';
import { OrderFile } from '../entities/order-file.entity';

@Profile()
export class OrderFileProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Configuration, ResponseConfigurationDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] });
    mapper.createMap(FileState, ResponseFileStateDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] });
    this.createMapFromOrderFileToResponseOrderFileDto(mapper);
  }

  createMapFromOrderFileToResponseOrderFileDto(mapper: AutoMapper) {
    mapper
      .createMap(OrderFile, ResponseOrderFileDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] })
      .forMember(
        (responseOrderFileDto) => responseOrderFileDto.order,
        mapDefer((orderFile) =>
          orderFile.order
            ? mapWith(ResponseOrderDto, (orderFile) => orderFile.order)
            : mapFrom((orderFile) => ({ id: orderFile.orderId })),
        ),
      )
      .forMember(
        (responseOrderFileDto) => responseOrderFileDto.file,
        mapDefer((orderFile) =>
          orderFile.file
            ? mapWith(ResponseFileDto, (orderFile) => orderFile.file)
            : mapFrom((orderFile) => ({ id: orderFile.fileId })),
        ),
      );
  }
}
