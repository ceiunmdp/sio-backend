import { PartialType } from '@nestjs/swagger';
import { UpdateRelationDto } from './update-relation.dto';

export class PartialUpdateRelationDto extends PartialType(UpdateRelationDto) {}
