import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from '../users/users.module';
import { Scholarship } from './entities/scholarship.entity';
//! Profiles
import './profiles/scholarship.profile';
import { ScholarshipsController } from './scholarships.controller';
import { ScholarshipsRepository } from './scholarships.repository';
import { ScholarshipsService } from './scholarships.service';

@Module({
  imports: [
    SharedModule,
    AppConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([Scholarship, ScholarshipsRepository]),
  ],
  controllers: [ScholarshipsController],
  providers: [ScholarshipsService],
  exports: [ScholarshipsService],
})
export class ScholarshipsModule {}
