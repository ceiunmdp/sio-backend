import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PaginationLimitPipe implements PipeTransform {
  transform(limit: number) {
    return limit <= 0 ? 10 : limit > 100 ? 100 : limit;
  }
}
