import { Module } from '@nestjs/common';
import { CampusUsersModule } from 'src/users/campus-users/campus-users.module';
import { CampusUserController } from './campus-user.controller';

@Module({
  imports: [CampusUsersModule],
  controllers: [CampusUserController],
})
export class CampusUserModule {}
