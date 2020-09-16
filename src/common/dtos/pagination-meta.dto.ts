import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ description: `The amount of items on this specific page`, example: 3 })
  item_count: number;

  @ApiProperty({ description: `The total amount of items`, example: 3 })
  total_items: number;

  @ApiProperty({ description: `The amount of items that were requested per page`, example: 10 })
  items_per_page: number;

  @ApiProperty({ description: `The total amount of pages in this paginator`, example: 1 })
  total_pages: number;

  @ApiProperty({ description: `The current page this paginator "points" to`, example: 1 })
  current_page: number;
}
