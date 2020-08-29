import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { GeneralUsersModule } from 'src/users/general-users.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SharedModule, GeneralUsersModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
