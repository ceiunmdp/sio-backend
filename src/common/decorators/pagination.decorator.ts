import { DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
import { DEFAULT_LIMIT } from '../constants/limits';
import { PaginationLimitPipe } from '../pipes/pagination-limit.pipe';

export const Limit = (property = 'limit') =>
  Query(property, new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe, PaginationLimitPipe);

export const Page = (property = 'page') => Query(property, new DefaultValuePipe(1), ParseIntPipe);

// TODO: Find a way to make ParseUUIDPipe optional
// TODO: Using ParseUUIDPipe could enter in conflict between DB's UUIDs and Firebase UUIDS
// export const PageToken = (property = 'page') => Query(property, new DefaultValuePipe(undefined), ParseUUIDPipe);
export const PageToken = (property = 'page') => Query(property, new DefaultValuePipe(undefined));
