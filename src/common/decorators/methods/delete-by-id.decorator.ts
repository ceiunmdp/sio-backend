import { applyDecorators, Delete } from '@nestjs/common';
import { IdQuery } from '../id-swagger.decorator';
import { BaseResponses } from './responses/base-responses.decorator';
import { ApiDeleteOkResponseCustom, ApiNotFoundResponseCustom } from './responses/custom-responses.decorator';

// eslint-disable-next-line @typescript-eslint/ban-types
export const DeleteById = (collection: string, path: string | string[] = ':id') => {
  const item = collection.slice(0, -1);

  return applyDecorators(
    Delete(path),
    IdQuery(),
    BaseResponses(),
    ApiDeleteOkResponseCustom(item),
    ApiNotFoundResponseCustom(item),
  );
};
