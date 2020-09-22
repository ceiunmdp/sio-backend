import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { MulterConfigModule } from 'src/config/multer/multer-config.module';
import { MulterConfigService } from 'src/config/multer/multer-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { ProfessorshipsModule } from 'src/users/professorships/professorships.module';
import { File } from './entities/file.entity';
import { FilesController } from './files.controller';
import { FilesRepository } from './files.repository';
import { FilesService } from './files.service';
//! Profiles
import './profiles/file.profile';

@Module({
  imports: [
    SharedModule,
    AppConfigModule,
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      useExisting: MulterConfigService,
    }),
    forwardRef(() => ProfessorshipsModule),
    TypeOrmModule.forFeature([File, FilesRepository]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
