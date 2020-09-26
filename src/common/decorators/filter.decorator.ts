import { Query } from '@nestjs/common';

// export const Filter = (property = 'filter') => Query(property, ParseBase64Pipe);
export const Filter = (property = 'filter') => Query(property);
