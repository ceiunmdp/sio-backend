import { Body, Param, ParseArrayPipe } from '@nestjs/common';
import { ParseArrayUUIDPipe } from '../pipes/parse-array-uuid.pipe';

export const ArrayId = (property = 'ids', requestSection: 'param' | 'body' = 'param') =>
  requestSection === 'param'
    ? Param(property, new ParseArrayPipe({ items: String, separator: ',' }), ParseArrayUUIDPipe)
    : Body(property, new ParseArrayPipe({ items: String, separator: ',' }), ParseArrayUUIDPipe);
