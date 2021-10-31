import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from '../users/users.module';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { Admin } from './entities/admin.entity';
//! Profiles
import './profiles/admin.profile';

@Module({
  imports: [AppConfigModule, FilesModule, UsersModule, TypeOrmModule.forFeature([Admin])],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
