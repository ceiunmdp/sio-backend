import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { MapperInterceptor } from '../interceptors/mapper.interceptor';

// eslint-disable-next-line @typescript-eslint/ban-types
export function Mapper(destination: Function) {
  return applyDecorators(SetMetadata('destination', destination), UseInterceptors(MapperInterceptor));
}
