import { CronJob } from 'cron';
import { AutoMap } from 'nestjsx-automapper';

export class Task {
  readonly id!: string;
  readonly running!: boolean;
  readonly lastDate?: Date;
  readonly nextDate?: Date;

  //! Tricked AutoMapper
  @AutoMap(() => String)
  readonly cronJob!: CronJob;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}
