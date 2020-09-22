import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Collection } from 'src/common/enums/collection.enum';

@ApiTags(Collection.RELATIONS)
@Controller()
export class RelationsController {}
