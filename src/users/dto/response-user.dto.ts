import { Exclude } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';

@Exclude()
export class ResponseUserDto extends ResponseBaseEntity {
  constructor(partial: Partial<ResponseUserDto>) {
    super();
    Object.assign(this, partial);
  }
}
