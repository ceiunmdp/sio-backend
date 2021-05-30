import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Group } from 'src/common/classes/group.class';
import { ResponseScholarshipDto } from 'src/users/scholarships/dtos/response-scholarship.dto';
@Exclude()
export class ResponseLoggedInScholarshipDto extends ResponseScholarshipDto {
  @Expose({ groups: [Group.ADMIN, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Student's balance`, example: 151.5 })
  balance!: number;

  constructor(partial: Partial<ResponseLoggedInScholarshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
