import { Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class ParseArrayUUIDPipe implements PipeTransform<string[], string[]> {
  transform(ids: string[]) {
    return ids.map((id) => {
      if (isUUID(id)) {
        return id;
      } else {
        throw new UnprocessableEntityException('Validation failed (UUID  is expected)');
      }
    });
  }
}
