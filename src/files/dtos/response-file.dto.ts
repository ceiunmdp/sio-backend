import { ApiProperty } from '@nestjs/swagger';
import * as bytes from 'bytes';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { ALL_GROUPS } from 'src/common/constants/all-groups';
import { ResponseCourseDto } from 'src/faculty-entities/courses/dtos/response-course.dto';
import { ResponseUserDto } from 'src/users/users/dtos/response-user.dto';
import { FileType } from '../enums/file-type.enum';

@Exclude()
export class ResponseFileDto extends ResponseBaseEntityDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `File's name`, example: 'Practice N° 1' })
  name!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `File's mimetype`, example: 'application/pdf' })
  mimetype!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `File's number of sheets`, example: 53 })
  numberOfSheets!: number;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `File's size`, example: bytes('14.6MB') })
  size!: number;

  @AutoMap(() => ResponseUserDto)
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `File's owner` })
  owner!: ResponseUserDto;

  @AutoMap(() => ResponseCourseDto)
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Courses file belongs to` })
  courses!: ResponseCourseDto[];

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `File type`, example: FileType.SYSTEM_STAFF })
  type!: FileType;
}
