import { applyDecorators, Get } from '@nestjs/common';
import { ResponsePaginationDto } from 'src/common/dtos/pagination.dto';
import { Mapper } from '../mapper.decorator';
import { Pagination } from '../pagination-swagger.decorator';
import { BaseResponses } from './responses/base-responses.decorator';
import { ApiAllOkResponseCustom } from './responses/custom-responses.decorator';

// eslint-disable-next-line @typescript-eslint/ban-types
export const GetAll = (collection: string, type: Function, path?: string | string[]) =>
  applyDecorators(
    Get(path),
    Pagination(),
    Mapper(type),
    BaseResponses(),
    ApiAllOkResponseCustom(collection, ResponsePaginationDto),
  );
