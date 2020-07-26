import { ParseArrayPipe } from '@nestjs/common';

export class ParseArrayPipeIds extends ParseArrayPipe {
  constructor() {
    super({
      items: Number,
      separator: ',',
      optional: true
    });
  }
}
