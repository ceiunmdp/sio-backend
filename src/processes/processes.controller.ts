import { Controller, HttpStatus, Res } from '@nestjs/common';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Response } from 'express';
import { Path } from 'src/common/enums/path.enum';
import { Connection } from 'typeorm';
import { Auth } from '../common/decorators/auth.decorator';
import { PostAll } from '../common/decorators/methods/post-all.decorator';
import { Collection } from '../common/enums/collection.enum';
import { IsolationLevel } from '../common/enums/isolation-level.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { ProcessesService } from './processes.service';

@ApiTags(Collection.PROCESSES)
@Controller()
export class ProcessesController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly processesService: ProcessesService,
  ) {}

  @PostAll('', null, Path.AVAILABLE_COPIES_RELOADER, { withoutOk: true, withoutMapper: true })
  @Auth(UserRole.ADMIN)
  @ApiNoContentResponse({ description: 'Available copies reloaded' })
  async create(@Res() response: Response) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      await this.processesService.reloadAvailableCopies(manager);
      response.sendStatus(HttpStatus.NO_CONTENT);
    });
  }
}
