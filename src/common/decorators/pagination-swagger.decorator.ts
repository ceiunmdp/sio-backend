import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const Pagination = () =>
  applyDecorators(
    ApiQuery({ name: 'limit', description: 'Maximum number of items per page', example: 10 }),
    ApiQuery({ name: 'page', description: 'Number of page to retrieve', example: 2 }),
  );
