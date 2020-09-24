import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { RolesModule } from 'src/roles/roles.module';
import { SharedModule } from 'src/shared/shared.module';
import { User } from './entities/user.entity';
//! Profiles
import './profiles/user.profile';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [SharedModule, AppConfigModule, RolesModule, TypeOrmModule.forFeature([User, UsersRepository])],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
