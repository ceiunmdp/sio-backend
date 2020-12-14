/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsEntityExistConstraint } from '../classes/is-entity-exist.validator';

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
