import { DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
import { LimitPipe } from '../pipes/limit.pipe';

export const Page = () => Query('page', new DefaultValuePipe(1), ParseIntPipe);
export const Limit = () => Query('limit', new DefaultValuePipe(10), ParseIntPipe, LimitPipe);
export const Sort = () => Query('sort');

// export function Pagination() {
//   return applyDecorators(Page());
// }
