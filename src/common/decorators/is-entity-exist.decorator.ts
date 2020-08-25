import { applyDecorators } from '@nestjs/common';
import { IsUUID, ValidationOptions } from 'class-validator';
import { IsEntityExistDecorator } from 'src/validators/decorators/is-entity-exist.decorator';

// eslint-disable-next-line @typescript-eslint/ban-types
export const IsEntityExist = (entity: Function, validationOptions?: ValidationOptions) =>
  applyDecorators(IsUUID(), IsEntityExistDecorator(entity, validationOptions));
