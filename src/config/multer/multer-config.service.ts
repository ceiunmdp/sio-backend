/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { InjectConnection } from '@nestjs/typeorm';
import * as appRoot from 'app-root-path';
import * as bytes from 'bytes';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs-extra';
import { lookup } from 'mime-types';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { buildFilename } from 'src/files/utils/build-filename';
import { Connection, In } from 'typeorm';
import { ParameterType } from '../parameters/enums/parameter-type.enum';
import { ParametersService } from '../parameters/parameters.service';

interface MulterEnvironmentVariables {
  'multer.destination': string;
  'multer.temporaryFilesDirectory': string;
}

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  private readonly ACCEPTED_MIME_TYPES = [lookup('pdf')];

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService<MulterEnvironmentVariables>,
    private readonly parametersService: ParametersService,
  ) {}

  get basePath() {
    return join(appRoot.path, this.configService.get<string>('multer.destination'));
  }

  get temporaryFilesDirectory() {
    return this.configService.get<string>('multer.temporaryFilesDirectory');
  }

  private async getDestination(
    request: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    try {
      const coursesIds = await this.checkAndGetCoursesIdsParameters(request);
      const fullPath = join(this.basePath, coursesIds[0]);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath);
      }

      cb(null, fullPath);
    } catch (error) {
      cb(error, null);
    }
  }

  private async checkAndGetCoursesIdsParameters(request: Request) {
    const ids = request.body.courses_ids as string;

    if (!ids) {
      throw new UnprocessableEntityException('courses_ids was not provided');
    } else {
      const coursesIds = ids.split(',');
      this.checkCoursesIdsAreValidUUIDs(coursesIds);
      await this.checkCoursesIdsAreValidCourses(coursesIds);
      return coursesIds;
    }
  }

  private checkCoursesIdsAreValidUUIDs(ids: string[]) {
    ids.forEach((id) => {
      if (!isUUID(id)) throw new UnprocessableEntityException(`course_id '${id}' is not a valid UUID`);
    });
  }

  private async checkCoursesIdsAreValidCourses(ids: string[]) {
    const courses = await this.connection.manager.getRepository(Course).find({ where: { id: In(ids) } });

    if (!(ids.length === courses.length)) {
      const coursesSet = new Set(courses.map((course) => course.id));
      ids.forEach((id) => {
        if (!coursesSet.has(id))
          throw new UnprocessableEntityException(`course_id '${id}' does not correspond to any existing Course`);
      });
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
    try {
      return {
        fileSize: (
          await this.parametersService.findByCode(ParameterType.FILES_MAX_SIZE_ALLOWED, this.connection.manager)
        ).value,
      };
    } catch (error) {
      return {
        fileSize: bytes('100MB'),
      };
    }
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
