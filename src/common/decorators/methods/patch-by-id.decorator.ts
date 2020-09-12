import { applyDecorators, Patch } from '@nestjs/common';
import { IdQuery } from '../id-swagger.decorator';
import { Mapper } from '../mapper.decorator';
import { BaseBodyResponses } from './responses/base-body-responses.decorator';
import { BaseResponses } from './responses/base-responses.decorator';
import { ApiNotFoundResponseCustom, ApiPatchOkResponseCustom } from './responses/custom-responses.decorator';

// eslint-disable-next-line @typescript-eslint/ban-types
export const PatchById = (collection: string, type: Function, path: string | string[] = ':id') => {
  const item = collection.slice(0, -1);

  return applyDecorators(
    Patch(path),
    IdQuery(),
    Mapper(type),
    BaseResponses(),
    BaseBodyResponses(),
    ApiPatchOkResponseCustom(item, type),
    ApiNotFoundResponseCustom(item),
  );
};
