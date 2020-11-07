import { Param, ParseUUIDPipe } from '@nestjs/common';
import { EntityExistsPipe } from '../pipes/entity-exists.pipe';

export const ParentCollectionId = <T>(property: string, type: new (partial: Partial<T>) => T) =>
  Param(property, ParseUUIDPipe, new EntityExistsPipe<T>(type));
