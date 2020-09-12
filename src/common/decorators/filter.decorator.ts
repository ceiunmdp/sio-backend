import { Query } from '@nestjs/common';
import { FilterPipe } from '../pipes/filter.pipe';

export const Filter = (property = 'filter') => Query(property, FilterPipe);
