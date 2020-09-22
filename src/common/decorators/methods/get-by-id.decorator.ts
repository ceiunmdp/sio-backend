/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, Get } from '@nestjs/common';
import { IdQuery } from '../id-swagger.decorator';
import { Mapper } from '../mapper.decorator';
import { BaseResponses } from './responses/base-responses.decorator';
import { ApiNotFoundResponseCustom, ApiOkResponseCustom } from './responses/custom-responses.decorator';

export const GetById = (
  collection: string,
  type: Function,
  path: string | string[] = ':id',
  options?: { withoutId?: boolean; withoutOk?: boolean; withoutMapper?: boolean },
) => {
  const item = collection.slice(0, -1);

  let decoratorsCombination = applyDecorators(Get(path), BaseResponses(), ApiNotFoundResponseCustom(item));

  decoratorsCombination = options?.withoutId
    ? decoratorsCombination
    : applyDecorators(decoratorsCombination, IdQuery());

  decoratorsCombination = options?.withoutOk
    ? decoratorsCombination
    : applyDecorators(decoratorsCombination, ApiOkResponseCustom(item, type));

  return options?.withoutMapper ? decoratorsCombination : applyDecorators(decoratorsCombination, Mapper(type));
};
