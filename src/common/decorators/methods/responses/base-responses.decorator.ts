import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { CustomError } from 'src/common/classes/custom-error.class';

export const BaseResponses = () =>
  applyDecorators(
    ApiTooManyRequestsResponse({ description: 'Too Many Requests', type: CustomError }),
    ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: CustomError }),
  );
