import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterConfigModule } from 'src/config/multer/multer-config.module';
import { MulterConfigService } from 'src/config/multer/multer-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { File } from './entities/file.entity';

@Module({
  imports: [
    SharedModule,
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      useExisting: MulterConfigService,
    }),
    TypeOrmModule.forFeature([File]),
  ],
})
export class FilesModule {}
