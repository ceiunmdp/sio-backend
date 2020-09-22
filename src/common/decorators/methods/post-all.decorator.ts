import { applyDecorators, Post } from '@nestjs/common';
import { Mapper } from '../mapper.decorator';
import { BaseBodyResponses } from './responses/base-body-responses.decorator';
import { BaseResponses } from './responses/base-responses.decorator';
import { ApiPostOkResponseCustom } from './responses/custom-responses.decorator';

// eslint-disable-next-line @typescript-eslint/ban-types
export const PostAll = (collection: string, type: Function, path?: string | string[]) => {
  const item = collection.slice(0, -1);

  return applyDecorators(
    Post(path),
    Mapper(type),
    BaseResponses(),
    BaseBodyResponses(),
    ApiPostOkResponseCustom(item, type),
  );
};
