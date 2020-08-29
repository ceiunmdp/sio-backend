import { Exclude } from 'class-transformer';
import { ResponseUserDto } from 'src/users/users/dto/response-user.dto';

@Exclude()
export class ResponseScholarshipDto extends ResponseUserDto {
  constructor(partial: Partial<ResponseScholarshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
