import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { AuthZGuard } from 'src/auth/guards/authz.guard';

@ApiBearerAuth()
@ApiTags('Relations')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('relations')
@UseGuards(AuthZGuard)
// @UseGuards(AuthNGuard, AuthZGuard)
export class RelationsController {}
