import { applyDecorators, Get } from '@nestjs/common';
import { IdQuery } from '../id-swagger.decorator';
import { Mapper } from '../mapper.decorator';
import { BaseResponses } from './responses/base-responses.decorator';
import { ApiNotFoundResponseCustom, ApiOkResponseCustom } from './responses/custom-responses.decorator';

// eslint-disable-next-line @typescript-eslint/ban-types
export const GetById = (collection: string, type: Function, path: string | string[] = ':id') => {
  const item = collection.slice(0, -1);

  return applyDecorators(
    Get(path),
    IdQuery(),
    Mapper(type),
    BaseResponses(),
    ApiOkResponseCustom(item, type),
    ApiNotFoundResponseCustom(item),
  );
};
