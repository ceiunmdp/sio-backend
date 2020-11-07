import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { EFileState } from '../../enums/e-file-state.enum';

export class UpdateFileStateDto {
  //? @IsIn([EFileState.TO_PRINT, EFileState.PRINTING])
  @IsIn([EFileState.PRINTING])
  @ApiProperty({ description: `File's state code`, example: EFileState.TO_PRINT })
  code!: EFileState;
}
