import {
  BadRequestException,
  Body,
  Controller,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Response } from 'express';
import { readFileSync } from 'fs-extra';
import { lookup } from 'mime-types';
import { PDFDocument } from 'pdf-lib';
import { ALL_ROLES } from 'src/common/constants/all-roles';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { DeleteById } from 'src/common/decorators/methods/delete-by-id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PostAll } from 'src/common/decorators/methods/post-all.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Sort } from 'src/common/decorators/sort.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection, EntityManager } from 'typeorm';
import { CreateFileDto } from './dtos/create-file.dto';
import { PartialUpdateFileDto } from './dtos/partial-update-file.dto';
import { ResponseFileDto } from './dtos/response-file.dto';
import { UpdateFileDto } from './dtos/update-file.dto';
import { File } from './entities/file.entity';
import { FilesService } from './files.service';

@ApiTags(Collection.FILES)
@Controller()
export class FilesController {
  private readonly filesServiceProxy: CrudService<File>;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    private readonly filesService: FilesService,
  ) {
    this.filesServiceProxy = new ProxyCrudService(connection, filesService);
  }

  @GetAll(Collection.FILES, ResponseFileDto)
  @Auth(...ALL_ROLES)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<File>) {
    return this.filesServiceProxy.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.FILES}`,
      },
      where,
      order,
    );
  }

  @GetAll(Collection.FILES, ResponseFileDto, Path.ME)
  @Auth(...ALL_ROLES)
  async findAllOwn(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<File>,
    @User() user: UserIdentity,
  ) {
    return this.filesServiceProxy.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.FILES}`,
      },
      where,
      order,
      undefined,
      user,
    );
  }

  @GetById(Collection.FILES, ResponseFileDto)
  @Auth(...ALL_ROLES)
  async findOne(@Id() id: string, @User() user: UserIdentity) {
    return this.filesServiceProxy.findOne(id, undefined, user);
  }

  @GetById(Collection.FILES, ResponseFileDto, '/:id/content', { withoutOk: true, withoutMapper: true })
  @Auth(...ALL_ROLES)
  @ApiOkResponse({
    description: 'PDF file',
    content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } },
  })
  async findContentById(@Id() id: string, @User() user: UserIdentity, @Res() response: Response) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      const buffer = await this.filesService.findContentById(id, manager, user);

      response.setHeader('Content-Type', lookup('pdf') as string);
      response.setHeader('Content-Length', buffer.length);
      response.status(200).send(buffer);
    });
  }

  @PostAll(Collection.FILES, ResponseFileDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, UserRole.PROFESSORSHIP)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('course_id') courseId: string,
    @User() user: UserIdentity,
  ) {
    return this.filesServiceProxy.create(await this.createAndValidateDto(file, courseId, user.id), undefined, user);
  }

  @PostAll(Collection.FILES, ResponseFileDto, '/bulk')
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, UserRole.PROFESSORSHIP)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadBulk(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('course_id') courseId: string,
    @User() user: UserIdentity,
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.filesService.createBulk(
        await Promise.all(files.map((file) => this.createAndValidateDto(file, courseId, user.id))),
        manager,
        user,
      );
    });
  }

  private async createAndValidateDto(file: Express.Multer.File, courseId: string, userId: string) {
    const createFileDto = new CreateFileDto({
      name: file.originalname,
      mimetype: file.mimetype,
      numberOfSheets: (await PDFDocument.load(readFileSync(file.path))).getPageCount(),
      size: file.size,
      path: file.path,
      ownerId: userId,
      courseId,
    });

    const errors = await validate(createFileDto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    return createFileDto;
  }

  @PutById(Collection.FILES, ResponseFileDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, UserRole.PROFESSORSHIP)
  async update(@Id() id: string, @Body() updateFileDto: UpdateFileDto, @User() user: UserIdentity) {
    return this.filesServiceProxy.update(id, updateFileDto, undefined, user);
  }

  @PatchById(Collection.FILES, ResponseFileDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, UserRole.PROFESSORSHIP)
  async partialUpdate(
    @Id() id: string,
    @Body() partialUpdateFileDto: PartialUpdateFileDto,
    @User() user: UserIdentity,
  ) {
    return this.filesServiceProxy.update(id, partialUpdateFileDto, undefined, user);
  }

  @DeleteById(Collection.FILES)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, UserRole.PROFESSORSHIP)
  async remove(@Id() id: string, @User() user: UserIdentity) {
    return this.filesServiceProxy.remove(id, { softRemove: true }, undefined, user);
  }
}
