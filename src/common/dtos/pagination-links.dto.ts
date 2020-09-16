import { ApiProperty } from '@nestjs/swagger';

export class PaginationLinksDto {
  @ApiProperty({ description: `Link to the "first" page`, example: 'http://localhost:3000/api/v1/items?limit=10' })
  first?: string;

  @ApiProperty({ description: `Link to the "previous" page`, example: '' })
  previous?: string;

  @ApiProperty({ description: `Link to the "next" page`, example: '' })
  next?: string;

  @ApiProperty({
    description: `Link to the "last" page`,
    example: 'http://localhost:3000/api/v1/items?page=1&limit=10',
  })
  last?: string;
}
