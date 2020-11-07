import { Injectable, PipeTransform } from '@nestjs/common';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../constants/limits.constant';

@Injectable()
export class PaginationLimitPipe implements PipeTransform<number, number> {
  transform(limit: number) {
    return limit <= 0 ? DEFAULT_LIMIT : limit > MAX_LIMIT ? MAX_LIMIT : limit;
  }
}
