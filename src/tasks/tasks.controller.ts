import { Body, Controller, Param } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { PartialUpdateTaskDto } from './dtos/partial-update-task.dto';
import { ResponseTaskDto } from './dtos/response-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags(Collection.TASKS)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @GetAll(Collection.TASKS, ResponseTaskDto, '', { withoutPagination: true })
  @Auth(UserRole.ADMIN)
  async findAll() {
    return this.tasksService.findAll();
  }

  @GetById(Collection.TASKS, ResponseTaskDto, ':id', { withoutId: true })
  @ApiQuery({ name: 'id', description: `Task's id`, example: 'fileEraser' })
  @Auth(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @PutById(Collection.TASKS, ResponseTaskDto)
  @ApiQuery({ name: 'id', description: `Task's id`, example: 'fileEraser' })
  @Auth(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @PatchById(Collection.TASKS, ResponseTaskDto)
  @ApiQuery({ name: 'id', description: `Task's id`, example: 'fileEraser' })
  @Auth(UserRole.ADMIN)
  async partialUpdate(@Param('id') id: string, @Body() partialUpdateTaskDto: PartialUpdateTaskDto) {
    return this.tasksService.update(id, partialUpdateTaskDto);
  }
}
