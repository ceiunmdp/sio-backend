import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Functionality } from './entities/functionality.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
//! Profiles
// import './profiles/functionality.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Functionality])],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
