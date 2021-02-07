import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { UsersModule } from '../users/users.module';
import { CampusUsersController } from './campus-users.controller';
import { CampusUsersRepository } from './campus-users.repository';
import { CampusUsersService } from './campus-users.service';
import { CampusUser } from './entities/campus-user.entity';
//! Profiles
import './profiles/campus-user.profile';

@Module({
  imports: [AppConfigModule, UsersModule, TypeOrmModule.forFeature([CampusUser, CampusUsersRepository])],
  controllers: [CampusUsersController],
  providers: [CampusUsersService],
  exports: [CampusUsersService],
})
export class CampusUsersModule {}
