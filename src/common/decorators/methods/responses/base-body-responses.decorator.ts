import { applyDecorators } from '@nestjs/common';
import { ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { CustomError } from 'src/common/classes/custom-error.class';

export const BaseBodyResponses = () =>
  applyDecorators(ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity', type: CustomError }));
