import { Module } from '@nestjs/common';
import { AuthNGuard } from './authn.guard';
import { AuthZGuard } from './authz.guard';

@Module({
  providers: [AuthNGuard, AuthZGuard],
  exports: [AuthNGuard, AuthZGuard],
})
export class GuardsModule {}
