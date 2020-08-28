import { Exclude } from 'class-transformer';
import { ResponseUserDto } from 'src/users/firebase-users/dto/response-user.dto';

@Exclude()
export class ResponseStudentDto extends ResponseUserDto {
  constructor(partial: Partial<ResponseStudentDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
