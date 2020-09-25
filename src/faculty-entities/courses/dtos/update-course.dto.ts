import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateCourseRelationDto } from './create-course-relation.dto';

export class UpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Course's name`, example: 'Introduction to Artificial Intelligence' })
  name!: string;

  @IsArray()
  @ArrayNotEmpty() // === @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateCourseRelationDto)
  @ApiProperty({ description: `Course's relations`, type: [CreateCourseRelationDto] })
  relations!: CreateCourseRelationDto[];
}
