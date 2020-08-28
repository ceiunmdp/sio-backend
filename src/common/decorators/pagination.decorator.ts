import { DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
import { PaginationLimitPipe } from '../pipes/pagination-limit.pipe';

export const Limit = (property = 'limit') =>
  Query(property, new DefaultValuePipe(10), ParseIntPipe, PaginationLimitPipe);

export const Page = (property = 'page') => Query(property, new DefaultValuePipe(1), ParseIntPipe);

// TODO: Find a way to make ParseUUIDPipe optional
// export const PageToken = (property = 'page') => Query(property, new DefaultValuePipe(undefined), ParseUUIDPipe);
export const PageToken = (property = 'page') => Query(property, new DefaultValuePipe(undefined));

export const Sort = () => Query('sort');
