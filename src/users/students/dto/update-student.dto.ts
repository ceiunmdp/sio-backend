import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString, Max, Min, MinLength } from 'class-validator';
import { UpdateUserDto } from 'src/users/users/dtos/update-user.dto';
import { UserType } from 'src/users/users/enums/user-type.enum';

export class UpdateStudentDto extends UpdateUserDto {
  @IsNumber()
  @Min(-100000)
  @Max(100000)
  @ApiProperty({ description: `Student's balance`, example: 100 })
  balance!: number;

  @IsString()
  @MinLength(7)
  @ApiProperty({ description: `Student's DNI`, example: '40987654' })
  dni!: string;

  @IsIn([UserType.SCHOLARSHIP])
  @ApiProperty({ description: `User's type`, enum: [UserType.SCHOLARSHIP], example: UserType.SCHOLARSHIP })
  type!: UserType;
}
