import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Group } from 'src/common/classes/group.class';

@Exclude()
export class ResponseTaskDto {
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `Task's id`, example: 'fileEraser' })
  id!: string;

  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `Task's state`, example: 'true' })
  running!: boolean;

  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `Task's last run date`, example: '2020-09-22T06:00:00.000Z' })
  lastDate!: string;

  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `Task's next run date`, example: '2020-09-23T06:00:00.000Z' })
  nextDate!: string;
}
