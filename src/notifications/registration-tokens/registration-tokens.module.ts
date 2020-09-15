import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users/users.module';
import { RegistrationToken } from './entities/registration-token.entity';
//! Profiles
import './profiles/registration-token.profile';
import { RegistrationTokensController } from './registration-tokens.controller';
import { RegistrationTokensService } from './registration-tokens.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([RegistrationToken])],
  controllers: [RegistrationTokensController],
  providers: [RegistrationTokensService],
  exports: [RegistrationTokensService],
})
export class RegistrationTokensModule {}
