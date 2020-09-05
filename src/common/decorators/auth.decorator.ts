import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthNGuard } from 'src/common/guards/authn.guard';
import { AuthZGuard } from 'src/common/guards/authz.guard';
import { CustomError } from '../classes/custom-error.class';

export const Auth = (...roles: string[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthNGuard, AuthZGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: CustomError }),
    ApiForbiddenResponse({ description: 'Forbidden', type: CustomError }),
  );
