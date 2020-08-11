import { applyDecorators, SetMetadata } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/ban-types
export function Mapper(destination: Function) {
  return applyDecorators(
    SetMetadata('destination', destination),
    // UseInterceptors(MapperInterceptor)
  );
}
