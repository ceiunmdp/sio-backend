import { Body, Controller, UnprocessableEntityException } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { flatten } from 'lodash';
import { DeleteById } from 'src/common/decorators/methods/delete-by-id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { ResponseCourseDto } from 'src/faculty-entities/courses/dtos/response-course.dto';
import { Connection } from 'typeorm';
import { CustomError } from './../../common/classes/custom-error.class';
import { ALL_ROLES } from './../../common/constants/all-roles';
import { Auth } from './../../common/decorators/auth.decorator';
import { Filter } from './../../common/decorators/filter.decorator';
import { Id } from './../../common/decorators/id.decorator';
import { GetById } from './../../common/decorators/methods/get-by-id.decorator';
import { PatchById } from './../../common/decorators/methods/patch-by-id.decorator';
import { PostAll } from './../../common/decorators/methods/post-all.decorator';
import { PutById } from './../../common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from './../../common/decorators/pagination.decorator';
import { Sort } from './../../common/decorators/sort.decorator';
import { UserRole } from './../../common/enums/user-role.enum';
import { CrudService } from './../../common/interfaces/crud-service.interface';
import { Order } from './../../common/interfaces/order.type';
import { Where } from './../../common/interfaces/where.type';
import { ProxyCrudService } from './../../common/services/proxy-crud.service';
import { AppConfigService } from './../../config/app/app-config.service';
import { CoursesService } from './courses.service';
import { CreateCourseRelationDto } from './dtos/create-course-relation.dto';
import { CreateCourseDto } from './dtos/create-course.dto';
import { PartialUpdateCourseDto } from './dtos/partial-update-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { Course } from './entities/course.entity';

@ApiTags(Collection.COURSES)
@Controller()
export class CoursesController {
  private readonly coursesService: CrudService<Course>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    coursesService: CoursesService,
  ) {
    this.coursesService = new ProxyCrudService(connection, coursesService);
  }

  @GetAll(Collection.COURSES, ResponseCourseDto)
  @Auth(...ALL_ROLES)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<Course>) {
    return this.coursesService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.COURSES}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.COURSES, ResponseCourseDto)
  @Auth(...ALL_ROLES)
  async findById(@Id() id: string) {
    return this.coursesService.findById(id);
  }

  @PostAll(Collection.COURSES, ResponseCourseDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another course.', type: CustomError })
  async create(@Body() createCourseDto: CreateCourseDto) {
    this.validateDto(createCourseDto);
    return this.coursesService.create(createCourseDto);
  }

  @PutById(Collection.COURSES, ResponseCourseDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another course.', type: CustomError })
  async update(@Id() id: string, @Body() updateCourseDto: UpdateCourseDto) {
    this.validateDto(updateCourseDto);
    return this.coursesService.update(id, updateCourseDto);
  }

  @PatchById(Collection.COURSES, ResponseCourseDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Name already assigned to another course.', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateCourseDto: PartialUpdateCourseDto) {
    this.validateDto(partialUpdateCourseDto);
    return this.coursesService.update(id, partialUpdateCourseDto);
  }

  @DeleteById(Collection.COURSES)
  @Auth(UserRole.ADMIN)
  async delete(@Id() id: string) {
    return this.coursesService.delete(id, { softRemove: true });
  }

  private validateDto(dto: PartialUpdateCourseDto) {
    this.checkIfRelationsIdsAreUnique(dto.relations);
    this.checkIfCareersIdsAreUnique(flatten(dto.relations.map((relation) => relation.careersIds)));
  }

  private checkIfRelationsIdsAreUnique(relations: CreateCourseRelationDto[]) {
    if (!this.checkIfArrayIsUnique(relations.map((relation) => relation.id))) {
      throw new UnprocessableEntityException('relations array has one or more elements repeated.');
    }
  }

  private checkIfCareersIdsAreUnique(ids: string[]) {
    if (!this.checkIfArrayIsUnique(ids)) {
      throw new UnprocessableEntityException('careerId repeated in two or more relations.');
    }
  }
  private checkIfArrayIsUnique(array: string[]) {
    return array.length === new Set(array).size;
  }
}
