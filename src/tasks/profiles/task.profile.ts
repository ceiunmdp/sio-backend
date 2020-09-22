import { AutoMapper, convertUsing, Profile, ProfileBase } from 'nestjsx-automapper';
import { DateStringConverter } from 'src/common/converters/date-string.converter';
import { ResponseTaskDto } from '../dtos/response-task.dto';
import { Task } from '../entities/task.entity';

@Profile()
export class TaskProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    this.createMapFromTaskToResponseTaskDto(mapper);
  }

  createMapFromTaskToResponseTaskDto(mapper: AutoMapper) {
    mapper
      .createMap(Task, ResponseTaskDto)
      .forMember(
        (dest) => dest.lastDate,
        convertUsing(new DateStringConverter(), (src) => src.lastDate),
      )
      .forMember(
        (dest) => dest.nextDate,
        convertUsing(new DateStringConverter(), (src) => src.nextDate),
      );
  }
}
