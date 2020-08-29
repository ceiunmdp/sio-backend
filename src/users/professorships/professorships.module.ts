import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { FilesModule } from 'src/files/files.module';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from '../users/users.module';
import { Professorship } from './entities/professorship.entity';
import { ProfessorshipsController } from './professorships.controller';
import { ProfessorshipsService } from './professorships.service';
//! Profiles
import './profiles/professorship.profile';
import { ProfessorshipSubscriber } from './subscribers/professorship.subscriber';

@Module({
  imports: [SharedModule, AppConfigModule, UsersModule, TypeOrmModule.forFeature([Professorship]), FilesModule],
  controllers: [ProfessorshipsController],
  providers: [ProfessorshipsService, ProfessorshipSubscriber],
  exports: [ProfessorshipsService],
})
export class ProfessorshipsModule {}
