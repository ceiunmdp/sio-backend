import { PartialType } from '@nestjs/swagger';
import { UpdateParameterDto } from './update-parameter.dto';

export class PartialUpdateParameterDto extends PartialType(UpdateParameterDto) {}
