import { PartialType } from '@nestjs/swagger';
import { UpdateCampusDto } from './update-campus.dto';

export class PartialUpdateCampusDto extends PartialType(UpdateCampusDto) {}
