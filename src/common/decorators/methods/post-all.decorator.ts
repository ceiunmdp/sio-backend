/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, Post } from '@nestjs/common';
import { Mapper } from '../mapper.decorator';
import { BaseBodyResponses } from './responses/base-body-responses.decorator';
import { BaseResponses } from './responses/base-responses.decorator';
import { ApiPostOkResponseCustom } from './responses/custom-responses.decorator';

export const PostAll = (
  collection: string,
  type: Function,
  path?: string | string[],
  options?: { withoutOk?: boolean; withoutMapper?: boolean },
) => {
  const item = collection.slice(0, -1);

  let decoratorsCombination = applyDecorators(Post(path), BaseResponses(), BaseBodyResponses());

  decoratorsCombination = options?.withoutOk
    ? decoratorsCombination
    : applyDecorators(decoratorsCombination, ApiPostOkResponseCustom(item, type));

  return options?.withoutMapper ? decoratorsCombination : applyDecorators(decoratorsCombination, Mapper(type));
};
