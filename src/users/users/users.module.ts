import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { FirebaseConfigModule } from 'src/config/firebase/firebase-config.module';
import { SharedModule } from 'src/shared/shared.module';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
//! Profiles
import './profiles/role.profile';
import './profiles/user.profile';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [SharedModule, AppConfigModule, FirebaseConfigModule, TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
