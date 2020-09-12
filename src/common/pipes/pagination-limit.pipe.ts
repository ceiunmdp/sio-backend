import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PaginationLimitPipe implements PipeTransform<number, number> {
  transform(limit: number) {
    return limit <= 0 ? 10 : limit > 100 ? 100 : limit;
  }
}
