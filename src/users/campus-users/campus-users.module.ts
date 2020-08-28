import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { SharedModule } from 'src/shared/shared.module';
import { FirebaseUsersModule } from '../firebase-users/firebase-users.module';
import { CampusUsersController } from './campus-users.controller';
import { CampusUsersRepository } from './campus-users.repository';
import { CampusUsersService } from './campus-users.service';
import { CampusUser } from './entities/campus-user.entity';
//! Profiles
import './profiles/campus-user.profile';

@Module({
  imports: [
    SharedModule,
    AppConfigModule,
    FirebaseUsersModule,
    TypeOrmModule.forFeature([CampusUser, CampusUsersRepository]),
  ],
  controllers: [CampusUsersController],
  providers: [CampusUsersService],
  exports: [CampusUsersService],
})
export class CampusUsersModule {}
