/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { MapperInterceptor } from '../interceptors/mapper.interceptor';

export const Mapper = (destination: Function) =>
  applyDecorators(SetMetadata('destination', destination), UseInterceptors(MapperInterceptor));
