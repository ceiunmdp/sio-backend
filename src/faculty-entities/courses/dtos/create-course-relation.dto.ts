import { ApiProperty } from '@nestjs/swagger';
import { IsEntitiesExist } from 'src/common/decorators/is-entities-exist.decorator';
import { IsEntityExist } from 'src/common/decorators/is-entity-exist.decorator';
import { Career } from 'src/faculty-entities/careers/entities/career.entity';
import { Relation } from 'src/faculty-entities/relations/entities/relation.entity';

export class CreateCourseRelationDto {
  @IsEntityExist(Relation)
  @ApiProperty({ description: `Relation's UUID`, example: '0de63cc8-d62d-4ea1-aa37-1846b6cf429d0' })
  id!: string;

  // TODO: Analyze if instead of an array of strings, it should be an array of objects
  @IsEntitiesExist(Career)
  @ApiProperty({
    name: 'careers_ids',
    description: `Career's UUIDs`,
    example: ['0de63cc8-d62d-4ea1-aa37-1846b6cf429d0', '911989ef-bb7c-4ca0-8cb3-bc2f976705a0'],
  })
  careersIds!: string[];
}
