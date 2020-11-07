import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ALL_GROUPS } from 'src/common/constants/all-groups.constant';

@Exclude()
export class ResponsePrinterDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Printer's UUID`, example: 'Incoming transfer' })
  id!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Printer's name`, example: 'Epson_L210_Series' })
  name!: string;

  constructor(partial: Partial<ResponsePrinterDto>) {
    Object.assign(this, partial);
  }
}
