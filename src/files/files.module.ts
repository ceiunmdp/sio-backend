import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigModule } from 'src/config/multer/multer-config.module';
import { MulterConfigService } from 'src/config/multer/multer-config.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule,
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      useExisting: MulterConfigService,
    }),
  ],
})
export class FilesModule {}
