import { Injectable, PipeTransform } from '@nestjs/common';
import { Base64 } from 'js-base64';
import { Where } from '../interfaces/where.type';

@Injectable()
export class FilterPipe implements PipeTransform<string, Where> {
  transform(filter: string) {
    return filter ? JSON.parse(Base64.fromBase64(filter)) : filter;
  }
}
