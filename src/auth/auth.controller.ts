import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthNGuard } from './guards/authn.guard';
import { AuthZGuard } from './guards/authz.guard';

@Controller()
@UseGuards(AuthNGuard, AuthZGuard)
export class AuthController {
  constructor(private authService: AuthService) {}
}
