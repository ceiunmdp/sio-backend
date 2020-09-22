import { PartialType } from '@nestjs/swagger';
import { UpdateTaskDto } from './update-task.dto';

export class PartialUpdateTaskDto extends PartialType(UpdateTaskDto) {}
