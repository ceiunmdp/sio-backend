import { DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
import { DEFAULT_LIMIT } from '../constants/limits.constant';
import { PaginationLimitPipe } from '../pipes/pagination-limit.pipe';

export const Limit = (property = 'limit') =>
  Query(property, new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe, PaginationLimitPipe);

export const Page = (property = 'page') => Query(property, new DefaultValuePipe(1), ParseIntPipe);
