import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { EFileState } from '../../enums/e-file-state.enum';

export class UpdateFileStateDto {
  @IsIn([EFileState.PRINTING, EFileState.PRINTED])
  @ApiProperty({ description: `File's state code`, example: EFileState.PRINTING })
  code!: EFileState;
}
