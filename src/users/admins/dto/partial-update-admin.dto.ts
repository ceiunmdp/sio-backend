import { PartialType } from '@nestjs/swagger';
import { UpdateAdminDto } from './update-admin.dto';

export class PartialUpdateAdminDto extends PartialType(UpdateAdminDto) {}
