import { CronExpression } from '@nestjs/schedule';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Matches } from 'class-validator';

export class UpdateTaskDto {
  @IsBoolean()
  @ApiProperty({ description: `Task's state`, example: true })
  running!: boolean;

  @IsString()
  @Matches(
    /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/,
  )
  @ApiProperty({ description: `Task's cron time`, example: CronExpression.EVERY_30_MINUTES })
  time!: string;
}
