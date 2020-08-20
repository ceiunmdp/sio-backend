import { applyDecorators } from '@nestjs/common';
import { IsUUID, ValidationOptions } from 'class-validator';
import { IsEntityExistDecorator } from 'src/validators/decorators/is-entity-exist.decorator';

// eslint-disable-next-line @typescript-eslint/ban-types
export function IsEntityExist(entity: Function, validationOptions?: ValidationOptions) {
  return applyDecorators(IsUUID(), IsEntityExistDecorator(entity, validationOptions));
}
