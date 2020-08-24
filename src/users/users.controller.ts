import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Path } from 'src/common/enums/path.enum';

@ApiTags('Users')
@Controller(Path.USERS)
export class UsersController {}
