import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { ParametersModule } from 'src/config/parameters/parameters.module';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from '../users/users.module';
import { Professorship } from './entities/professorship.entity';
import { ProfessorshipsController } from './professorships.controller';
import { ProfessorshipsRepository } from './professorships.repository';
import { ProfessorshipsService } from './professorships.service';
//! Profiles
import './profiles/professorship.profile';
import { ProfessorshipSubscriber } from './subscribers/professorship.subscriber';

@Module({
  imports: [
    AppConfigModule,
    ParametersModule,
    UsersModule,
    forwardRef(() => FilesModule),
    TypeOrmModule.forFeature([Professorship, ProfessorshipsRepository]),
  ],
  controllers: [ProfessorshipsController],
  providers: [ProfessorshipsService, ProfessorshipSubscriber],
  exports: [ProfessorshipsService],
})
export class ProfessorshipsModule {}
