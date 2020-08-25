import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { MapperInterceptor } from '../interceptors/mapper.interceptor';

// eslint-disable-next-line @typescript-eslint/ban-types
export const Mapper = (destination: Function) =>
  applyDecorators(SetMetadata('destination', destination), UseInterceptors(MapperInterceptor));
