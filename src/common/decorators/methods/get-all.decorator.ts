/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, Get } from '@nestjs/common';
import { ResponsePaginationDto } from 'src/common/dtos/pagination.dto';
import { Mapper } from '../mapper.decorator';
import { Pagination } from '../pagination-swagger.decorator';
import { BaseResponses } from './responses/base-responses.decorator';
import { ApiAllOkResponseCustom } from './responses/custom-responses.decorator';

export const GetAll = (
  collection: string,
  type: Function,
  path?: string | string[],
  options?: { withoutPagination?: boolean },
) => {
  const decoratorsCombination = applyDecorators(
    Get(path),
    Mapper(type),
    BaseResponses(),
    ApiAllOkResponseCustom(collection, options?.withoutPagination ? type : ResponsePaginationDto),
  );

  return options?.withoutPagination ? decoratorsCombination : applyDecorators(decoratorsCombination, Pagination());
};
