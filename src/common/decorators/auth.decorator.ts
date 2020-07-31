import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthNGuard } from 'src/common/guards/authn.guard';
import { AuthZGuard } from 'src/common/guards/authz.guard';

export function Auth(...roles: number[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthNGuard, AuthZGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
  );
}
