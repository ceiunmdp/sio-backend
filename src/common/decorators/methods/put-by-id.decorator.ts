import { applyDecorators, Put } from '@nestjs/common';
import { IdQuery } from '../id-swagger.decorator';
import { Mapper } from '../mapper.decorator';
import { BaseBodyResponses } from './responses/base-body-responses.decorator';
import { BaseResponses } from './responses/base-responses.decorator';
import { ApiNotFoundResponseCustom, ApiUpdateOkResponseCustom } from './responses/custom-responses.decorator';

// eslint-disable-next-line @typescript-eslint/ban-types
export const PutById = (collection: string, type: Function, path: string | string[] = ':id') => {
  const item = collection.slice(0, -1);

  return applyDecorators(
    Put(path),
    IdQuery(),
    Mapper(type),
    BaseResponses(),
    BaseBodyResponses(),
    ApiUpdateOkResponseCustom(item, type),
    ApiNotFoundResponseCustom(item),
  );
};
