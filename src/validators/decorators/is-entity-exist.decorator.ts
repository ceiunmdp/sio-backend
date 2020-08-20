import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsEntityExistConstraint } from '../validators/is-entity-exist.validator';

// eslint-disable-next-line @typescript-eslint/ban-types
export function IsEntityExistDecorator(entity: Function, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: IsEntityExistConstraint,
    });
  };
}
