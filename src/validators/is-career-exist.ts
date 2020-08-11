import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CareersRepository } from 'src/faculty-entities/careers/careers.repository';

export function IsCareerExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCareerExistValidator,
    });
  };
}

@Injectable()
@ValidatorConstraint({ async: true })
export class IsCareerExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly careersRepository: CareersRepository) {}

  // async validate(id: string, args: ValidationArguments) {
  async validate(id: string) {
    return !!(await this.careersRepository.findOne(id));
  }

  // defaultMessage(validationArguments?: ValidationArguments): string {
  defaultMessage(): string {
    return 'Default message.';
  }
}
