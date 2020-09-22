import { Query } from '@nestjs/common';
import { ParseBase64Pipe } from '../pipes/parse-base64.pipe';

export const Filter = (property = 'filter') => Query(property, ParseBase64Pipe);
