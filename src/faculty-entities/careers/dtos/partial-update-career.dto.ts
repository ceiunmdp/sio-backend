import { PartialType } from '@nestjs/swagger';
import { UpdateCareerDto } from './update-career.dto';

export class PartialUpdateCareerDto extends PartialType(UpdateCareerDto) {}
