import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { InjectConnection } from '@nestjs/typeorm';
import * as bytes from 'bytes';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs-extra';
import { lookup } from 'mime-types';
import { diskStorage } from 'multer';
import { join } from 'path';
import { CoursesService } from 'src/faculty-entities/courses/courses.service';
import { buildFilename } from 'src/files/utils/build-filename';
import { Connection } from 'typeorm';
import { ParametersService } from '../parameters/parameters.service';

interface MulterEnvironmentVariables {
  'multer.destination': string;
}

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  private readonly ACCEPTED_MIME_TYPES = [lookup('pdf')];

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService<MulterEnvironmentVariables>,
    private readonly coursesService: CoursesService,
    private readonly parametersService: ParametersService,
  ) {}

  get destination() {
    return this.configService.get<string>('multer.destination');
  }

  private async getDestination(
    request: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    const path = join(this.destination, await this.getCourseId(request));
    if (!existsSync(path)) {
      mkdirSync(path);
    }

    // TODO: Check if __dirname should be used
    cb(null, path);
  }

  private async getCourseId(request: Request) {
    const courseId = request.body.course_id;

    if (!courseId) {
      throw new UnprocessableEntityException('course_id was not provided');
    } else if (!isUUID(courseId)) {
      throw new UnprocessableEntityException('course_id is not a valid UUID');
    } else if (!(await this.coursesService.findById(courseId, this.connection.manager))) {
      throw new UnprocessableEntityException('course_id provided does not correspond to any existing Course');
    } else {
      return courseId;
    }
  }

  private getFilename(_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, buildFilename(file.originalname, file.mimetype));
  }

  private getStorage() {
    return diskStorage({
      destination: this.getDestination.bind(this),
      filename: this.getFilename.bind(this),
    });
  }

  private async getLimits() {
    // TODO: Change in deployment
    return { fileSize: bytes('100MB') };
    // return {
    //   fileSize: (await this.parametersService.findByCode(ParameterType.FILES_MAX_SIZE_ALLOWED, this.connection.manager))
    //     .value,
    // };
  }

  private async fileFilter(
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) {
    //! File size cannot be accessed here, service must check this condition
    cb(null, this.ACCEPTED_MIME_TYPES.includes(file.mimetype));
  }

  async createMulterOptions(): Promise<MulterOptions> {
    return {
      // dest: this.destination,
      storage: this.getStorage(),
      limits: await this.getLimits(),
      // preservePath: true
      fileFilter: this.fileFilter.bind(this),
    };
  }
}
