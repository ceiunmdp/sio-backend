import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { AuthNGuard } from 'src/auth/guards/authn.guard';
import { AuthZGuard } from 'src/auth/guards/authz.guard';

export function Auth(...roles: number[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthNGuard, AuthZGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
  );
}
