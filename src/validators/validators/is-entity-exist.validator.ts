import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { getManager } from 'typeorm';

@Injectable()
@ValidatorConstraint({ name: 'isEntityExist', async: true })
export class IsEntityExistConstraint implements ValidatorConstraintInterface {
  async validate(id: string, args: ValidationArguments) {
    return !!(await getManager().findOne(args.constraints[0], id));
  }

  defaultMessage(args?: ValidationArguments): string {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return `${args.property} provided does not correspond to any existing ${(args.constraints[0] as Function).name}`;
  }
}
