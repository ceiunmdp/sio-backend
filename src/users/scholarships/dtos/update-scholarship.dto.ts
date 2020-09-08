import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsPositive, Min } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { UpdateStudentDto } from 'src/users/students/dto/update-student.dto';
import { UserType } from 'src/users/users/enums/user-type.enum';

export class UpdateScholarshipDto extends UpdateStudentDto {
  @IsPositive()
  @ApiProperty({ name: 'available_copies', description: `Scholarship's available copies per quarter`, example: 500 })
  availableCopies!: number;

  @Min(0)
  @ApiProperty({ name: 'remaining_copies', description: `Scholarship's remaining copies per quarter`, example: 300 })
  remainingCopies!: number;

  @AutoMap(() => String)
  @IsIn([UserType.STUDENT])
  @ApiProperty({ description: `User's type`, enum: [UserType.STUDENT], example: UserType.STUDENT })
  type!: UserType;
}
