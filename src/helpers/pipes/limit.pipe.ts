import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class LimitPipe implements PipeTransform {
  transform(value: any) {
    return value > 100 ? 100 : value;
  }
}
