import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { FirebaseConfigModule } from 'src/config/firebase/firebase-config.module';
import { SharedModule } from 'src/shared/shared.module';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { FirebaseUsersController } from './firebase-users.controller';
import { FirebaseUsersService } from './firebase-users.service';
//! Profiles
import './profiles/role.profile';
import './profiles/user.profile';

@Module({
  imports: [SharedModule, AppConfigModule, FirebaseConfigModule, TypeOrmModule.forFeature([User, Role])],
  controllers: [FirebaseUsersController],
  providers: [FirebaseUsersService],
  exports: [FirebaseUsersService],
})
export class FirebaseUsersModule {}
