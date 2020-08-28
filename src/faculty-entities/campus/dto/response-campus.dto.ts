import { Exclude } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';

@Exclude()
export class ResponseCampusDto extends ResponseBaseEntity {
  constructor(partial: Partial<ResponseCampusDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
