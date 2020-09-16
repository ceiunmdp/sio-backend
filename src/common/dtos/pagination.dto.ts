import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntityDto } from '../base-classes/response-base-entity.dto';
import { PaginationLinksDto } from './pagination-links.dto';
import { PaginationMetaDto } from './pagination-meta.dto';

export class ResponsePaginationDto {
  @AutoMap(() => ResponseBaseEntityDto)
  items: ResponseBaseEntityDto[];

  @AutoMap(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  @AutoMap(() => PaginationLinksDto)
  links: PaginationLinksDto;
}
