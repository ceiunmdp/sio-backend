import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { diskStorage } from 'multer';

interface MulterEnvironmentVariables {
  'multer.destination': string;
  'multer.limitFileSize': number;
}

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  private readonly ACCEPTED_MIME_TYPES = ['application/pdf'];

  constructor(private readonly configService: ConfigService<MulterEnvironmentVariables>) {}

  //? Should be only one common destination or is convenient to split it into one folder per role?
  get destination() {
    return this.configService.get<string>('multer.destination');
  }

  get limitFileSize() {
    return this.configService.get<number>('multer.limitFileSize');
  }

  getDestination(request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    // TODO: If we decide to store each file in it's correponding folder according to role, here we have to retrieve the appropiate destination
    // TODO: Check if __dirname should be used
    cb(null, this.destination);
  }

  // TODO: Should this function be inside Files Module, in order to create and save metadata about the file prior to save it on disk?
  getFilename(request: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    // TODO: Logic to determine filename. Could be "UUID.extension"
    const filename = file.filename + '-' + Date.now();
    cb(null, filename);
  }

  getStorage() {
    return diskStorage({
      destination: this.getDestination,
      filename: this.getFilename,
    });
  }

  getLimits() {
    return { fileSize: this.limitFileSize };
  }

  fileFilter(request: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    // To reject this file pass `false`, like so:
    // cb(null, false);
    // To accept the file pass `true`, like so:
    // cb(null, true);
    // You can always pass an error if something goes wrong:
    // cb(new Error("I don't have a clue!"), false);

    // TODO: Check all conditions that are necessary
    cb(null, this.ACCEPTED_MIME_TYPES.includes(file.mimetype));
  }

  createMulterOptions(): MulterOptions {
    return {
      // dest: this.destination,
      storage: this.getStorage(),
      limits: this.getLimits(),
      // preservePath: true
      fileFilter: this.fileFilter,
    };
  }
}
