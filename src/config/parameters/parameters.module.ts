import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../app/app-config.module';
import { Parameter } from './entities/parameter.entity';
import { ParametersController } from './parameters.controller';
import { ParametersService } from './parameters.service';
//! Profiles
import './profiles/parameter.profile';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([Parameter])],
  controllers: [ParametersController],
  providers: [ParametersService],
  exports: [ParametersService],
})
export class ParametersModule {}
