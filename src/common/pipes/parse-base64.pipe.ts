import { Injectable, PipeTransform } from '@nestjs/common';
import { isBase64 } from 'class-validator';
import { Base64 } from 'js-base64';

@Injectable()
export class ParseBase64Pipe implements PipeTransform<string, any> {
  transform(value: string) {
    return value ? (isBase64(value) ? JSON.parse(Base64.fromBase64(value)) : value) : value;
  }
}
