import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { SharedModule } from 'src/shared/shared.module';
import { CampusController } from './campus.controller';
import { CampusRepository } from './campus.repository';
import { CampusService } from './campus.service';
import { Campus } from './entities/campus.entity';
//! Profiles
import './profiles/campus.profile';

@Module({
  imports: [SharedModule, AppConfigModule, TypeOrmModule.forFeature([Campus, CampusRepository])],
  controllers: [CampusController],
  providers: [CampusService],
  exports: [CampusService],
})
export class CampusModule {}
