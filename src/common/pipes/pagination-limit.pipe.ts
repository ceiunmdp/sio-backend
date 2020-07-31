import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PaginationLimitPipe implements PipeTransform {
  transform(value: any) {
    return value > 100 ? 100 : value;
  }
}
