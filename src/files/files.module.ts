import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // dest: configService.get<string>('MULTER_DEST'),
        storage: diskStorage({
          destination: configService.get<string>('MULTER_DEST'),
          filename(req: Request, file: Express.Multer.File, callback) {
            // TODO: Logic to determine filename
            const filename = 'filename';
            callback(null, filename);
          },
        }),
        limits: { fileSize: 104857600 }, // 100 MB
        // preservePath: true
        fileFilter(req: Request, file, callback) {
          // TODO: Check if file.mimetype === pdf

          // The function should call `cb` with a boolean
          // to indicate if the file should be accepted

          // To reject this file pass `false`, like so:
          callback(null, false);

          // To accept the file pass `true`, like so:
          callback(null, true);

          // You can always pass an error if something goes wrong:
          callback(new Error("I don't have a clue!"), false);
        },
      }),
    }),
  ],
})
export class FilesModule {}
