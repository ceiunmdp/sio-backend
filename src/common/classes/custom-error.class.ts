import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';

export class CustomError {
  @AutoMap()
  @ApiProperty({ description: `Error's status code`, example: 404 })
  status_code: number;

  @AutoMap()
  @ApiProperty({ description: `Error's name`, example: 'Not Found' })
  error: string;

  @AutoMap()
  @ApiProperty({ description: `Error's message`, example: 'User not found' })
  message: string;

  @AutoMap()
  @ApiProperty({ description: `Error's timestamp`, example: '2020-09-01T16:56:23.089Z' })
  timestamp: string;

  @AutoMap()
  @ApiProperty({
    description: `Request's path from where the error was originated`,
    example: '/api/v1/users/0de63cc8-d62d-4ea1-aa37-1846b6cf429d',
  })
  path: string;

  constructor(required: Required<CustomError>) {
    Object.assign(this, required);
  }
}
