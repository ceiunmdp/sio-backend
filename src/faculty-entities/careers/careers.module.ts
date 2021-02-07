import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { CareersController } from './careers.controller';
import { CareersRepository } from './careers.repository';
import { CareersService } from './careers.service';
import { Career } from './entities/career.entity';
//! Profiles
import './profiles/career.profile';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([Career, CareersRepository])],
  controllers: [CareersController],
  providers: [CareersService],
  exports: [CareersService],
})
export class CareersModule {}
