import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { ResponseCampusDto } from 'src/faculty-entities/campus/dtos/response-campus.dto';
import { ResponseStudentDto } from 'src/users/students/dto/response-student.dto';
import { ResponseOrderStateDto } from './response-order-state.dto';
import { ResponseOrderToOrderStateDto } from './response-order-to-order-state.dto';

@Exclude()
export class ResponseOrderDto extends ResponseBaseEntityDto {
  @AutoMap(() => ResponseStudentDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: 'Student associated with order' })
  student!: ResponseStudentDto;

  @AutoMap(() => ResponseCampusDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: 'Campus where the order was placed' })
  campus!: ResponseCampusDto;

  @AutoMap(() => ResponseOrderStateDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Order's state` })
  state!: ResponseOrderStateDto;

  @AutoMap(() => ResponseOrderToOrderStateDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Tracking of order's states`, type: [ResponseOrderToOrderStateDto] })
  tracking!: ResponseOrderToOrderStateDto[];

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Order's deposit` })
  deposit?: number;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Order's total price` })
  total!: number;

  constructor(partial: Partial<ResponseOrderDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
