import { OmitType } from '@nestjs/swagger';
import { UpdateStudentDto } from 'src/users/students/dto/update-student.dto';

export class UpdateLoggedInStudentDto extends OmitType(UpdateStudentDto, ['balance', 'disabled', 'type']) {}
