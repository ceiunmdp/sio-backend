import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from '../users/users.module';
import { Professorship } from './entities/professorship.entity';
import { ProfessorshipsController } from './professorships.controller';
import { ProfessorshipsService } from './professorships.service';
//! Profiles
import './profiles/professorship.profile';

@Module({
  imports: [SharedModule, AppConfigModule, UsersModule, TypeOrmModule.forFeature([Professorship])],
  controllers: [ProfessorshipsController],
  providers: [ProfessorshipsService],
  exports: [ProfessorshipsService],
})
export class ProfessorshipsModule {}
