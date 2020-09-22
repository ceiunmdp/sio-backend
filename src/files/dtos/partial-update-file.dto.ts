import { PartialType } from '@nestjs/swagger';
import { UpdateFileDto } from './update-file.dto';

export class PartialUpdateFileDto extends PartialType(UpdateFileDto) {}
