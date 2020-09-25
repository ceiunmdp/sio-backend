import { applyDecorators } from '@nestjs/common';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsUUID, Validate, ValidationOptions } from 'class-validator';
import { IsEntityExistConstraint } from 'src/validators/validators/is-entity-exist.validator';

// eslint-disable-next-line @typescript-eslint/ban-types
export const IsEntitiesExist = (entity: Function, validationOptions?: ValidationOptions) =>
  applyDecorators(
    IsArray(validationOptions),
    ArrayNotEmpty(validationOptions),
    ArrayUnique(validationOptions),
    Validate(IsUUID, { ...validationOptions, each: true }),
    Validate(IsEntityExistConstraint, [entity], { ...validationOptions, each: true }),
  );
