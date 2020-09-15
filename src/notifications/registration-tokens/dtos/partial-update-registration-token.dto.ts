import { PartialType } from '@nestjs/swagger';
import { UpdateRegistrationTokenDto } from './update-registration-token.dto';

export class PartialUpdateRegistrationTokenDto extends PartialType(UpdateRegistrationTokenDto) {}
