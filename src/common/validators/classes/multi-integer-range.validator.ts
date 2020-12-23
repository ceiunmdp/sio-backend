import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { multirange } from 'multi-integer-range';

@ValidatorConstraint({ name: 'multiIntegerRange', async: false })
export class MultiIntegerRange implements ValidatorConstraintInterface {
  validate(range: string) {
    try {
      return !!multirange(range);
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `range ${args.value} is not a valid multi-integer-range.`;
  }
}
