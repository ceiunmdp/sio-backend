import { AutoMapper, mapDefer, mapFrom, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseCourseDto } from 'src/faculty-entities/courses/dtos/response-course.dto';
import { ResponseUserDto } from 'src/users/users/dtos/response-user.dto';
import { ResponseFileDto } from '../dtos/response-file.dto';
import { File } from '../entities/file.entity';

@Profile()
export class FileProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(File, ResponseFileDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] })
      .forMember(
        (responseFileDto) => responseFileDto.owner,
        mapDefer((file) =>
          file.owner
            ? mapWith(ResponseUserDto, (file) => file.owner)
            : mapFrom((file) => (file.ownerId ? { id: file.ownerId } : null)),
        ),
      )
      .forMember(
        (responseFileDto) => responseFileDto.course,
        mapDefer((file) =>
          file.course ? mapWith(ResponseCourseDto, (file) => file.course) : mapFrom((file) => ({ id: file.courseId })),
        ),
      );
  }
}
