import { ApiProperty } from '@nestjs/swagger';

export class CustomError {
  @ApiProperty({ description: `Error's status code`, example: 404 })
  status_code?: number;

  @ApiProperty({ description: `Error's name`, example: 'Not Found' })
  error!: string;

  @ApiProperty({ description: `Error's message`, example: 'User not found' })
  message!: string;

  @ApiProperty({ description: `Error's timestamp`, example: '2020-09-01T16:56:23.089Z' })
  timestamp!: string;

  @ApiProperty({
    description: `Request's path from where the error was originated`,
    example: '/api/v1/users/0de63cc8-d62d-4ea1-aa37-1846b6cf429d',
  })
  path?: string;

  constructor(partial: Partial<CustomError>) {
    Object.assign(this, partial);
  }
}
