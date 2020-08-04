import { Param, ParseUUIDPipe } from '@nestjs/common';

export const Id = (property = 'id') => Param(property, ParseUUIDPipe);
