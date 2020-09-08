import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString, Max, Min } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { UpdateUserDto } from 'src/users/users/dtos/update-user.dto';
import { UserType } from 'src/users/users/enums/user-type.enum';

export class UpdateStudentDto extends UpdateUserDto {
  @IsNumber()
  @Min(0)
  @Max(9999.99)
  @ApiProperty({ description: `Student's balance`, example: 100 })
  // TODO: Decide if this endpoint allows to top up user's balance
  balance!: number;

  @IsString()
  @ApiProperty({ description: `Student's DNI`, example: '40987654' })
  dni!: string;

  @AutoMap(() => String)
  @IsIn([UserType.SCHOLARSHIP])
  @ApiProperty({ description: `User's type`, enum: [UserType.SCHOLARSHIP], example: UserType.SCHOLARSHIP })
  type!: UserType;
}
