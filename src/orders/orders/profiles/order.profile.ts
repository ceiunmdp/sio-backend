import { reverse, sortBy } from 'lodash';
import { AutoMapper, fromValue, mapDefer, mapFrom, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseCampusDto } from 'src/faculty-entities/campus/dtos/response-campus.dto';
import { ResponseStudentDto } from 'src/users/students/dto/response-student.dto';
import { ResponseOrderStateDto } from '../dtos/response/response-order-state.dto';
import { ResponseOrderToOrderStateDto } from '../dtos/response/response-order-to-order-state.dto';
import { ResponseOrderDto } from '../dtos/response/response-order.dto';
import { OrderState } from '../entities/order-state.entity';
import { OrderToOrderState } from '../entities/order-to-order-state.entity';
import { Order } from '../entities/order.entity';

@Profile()
export class OrderProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(OrderState, ResponseOrderStateDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] });
    mapper.createMap(OrderToOrderState, ResponseOrderToOrderStateDto);
    this.createMapFromOrderToResponseOrderDto(mapper);
  }

  createMapFromOrderToResponseOrderDto(mapper: AutoMapper) {
    mapper
      .createMap(Order, ResponseOrderDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] })
      .forMember(
        (responseOrderDto) => responseOrderDto.student,
        mapDefer((order) =>
          order.student
            ? mapWith(ResponseStudentDto, (order) => order.student)
            : mapFrom((order) => ({ id: order.studentId })),
        ),
      )
      .forMember(
        (responseOrderDto) => responseOrderDto.campus,
        mapDefer((order) =>
          order.campus
            ? mapWith(ResponseCampusDto, (order) => order.campus)
            : mapFrom((order) => ({ id: order.campusId })),
        ),
      )
      .forMember(
        (responseOrderDto) => responseOrderDto.tracking,
        mapDefer((order) =>
          order.orderToOrderStates
            ? mapWith(ResponseOrderToOrderStateDto, (order) =>
                reverse(sortBy(order.orderToOrderStates, (orderToOrderState) => orderToOrderState.timestamp)),
              )
            : fromValue(undefined),
        ),
      );
  }
}
