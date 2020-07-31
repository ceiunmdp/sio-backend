import { DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
import { PaginationLimitPipe } from '../pipes/pagination-limit.pipe';

export const Page = () => Query('page', new DefaultValuePipe(1), ParseIntPipe);
export const Limit = () => Query('limit', new DefaultValuePipe(10), ParseIntPipe, PaginationLimitPipe);
export const Sort = () => Query('sort');

// export function Pagination() {
//   return applyDecorators(Page());
// }
