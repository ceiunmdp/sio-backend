import { Injectable, PipeTransform } from '@nestjs/common';
import camelcaseKeys from 'camelcase-keys';
import { isObject } from 'lodash';

@Injectable()
export class CamelCasePipe implements PipeTransform {
  transform(value: any) {
    return isObject(value) ? camelcaseKeys(value, { deep: true }) : value;
  }
}
