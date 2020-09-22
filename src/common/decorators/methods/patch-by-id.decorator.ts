/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, Patch } from '@nestjs/common';
import { IdQuery } from '../id-swagger.decorator';
import { Mapper } from '../mapper.decorator';
import { BaseBodyResponses } from './responses/base-body-responses.decorator';
import { BaseResponses } from './responses/base-responses.decorator';
import { ApiNotFoundResponseCustom, ApiPatchOkResponseCustom } from './responses/custom-responses.decorator';

export const PatchById = (
  collection: string,
  type: Function,
  path: string | string[] = ':id',
  options?: { withoutId?: boolean },
) => {
  const item = collection.slice(0, -1);

  const decoratorsCombination = applyDecorators(
    Patch(path),
    Mapper(type),
    BaseResponses(),
    BaseBodyResponses(),
    ApiPatchOkResponseCustom(item, type),
    ApiNotFoundResponseCustom(item),
  );

  return options?.withoutId ? decoratorsCombination : applyDecorators(decoratorsCombination, IdQuery());
};
