import { Exclude } from 'class-transformer';
import { ResponseUserDto } from 'src/users/users/dtos/response-user.dto';

@Exclude()
export class ResponseAdminDto extends ResponseUserDto {
  constructor(partial: Partial<ResponseAdminDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
