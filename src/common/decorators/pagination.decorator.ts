import { DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
import { PaginationLimitPipe } from '../pipes/pagination-limit.pipe';

export const Page = (property = 'page') => Query(property, new DefaultValuePipe(1), ParseIntPipe);

export const Limit = (property = 'limit') =>
  Query(property, new DefaultValuePipe(10), ParseIntPipe, PaginationLimitPipe);

export const Sort = () => Query('sort');
