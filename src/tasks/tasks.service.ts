import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { PartialUpdateTaskDto } from './dtos/partial-update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  async findAll() {
    const mapCronJobs: Map<string, CronJob> = this.schedulerRegistry.getCronJobs();

    const tasks: Task[] = [];
    mapCronJobs.forEach((cronJob, name) => {
      tasks.push(this.createTask(name, cronJob));
    });

    return tasks;
  }

  async findOne(id: string) {
    try {
      const cronJob = this.schedulerRegistry.getCronJob(id);
      return this.createTask(id, cronJob);
    } catch (error) {
      throw new NotFoundException(`Tarea ${id} no encontrada.`);
    }
  }

  private createTask(id: string, cronJob: CronJob) {
    return new Task({
      id,
      running: cronJob.running,
      lastDate: cronJob.lastDate(),
      nextDate: cronJob.nextDate().toDate(),
      cronJob,
    });
  }

  async update(id: string, { running, time }: PartialUpdateTaskDto) {
    const cronJob = (await this.findOne(id)).cronJob;
    //* Store previous state to later compare with the new one
    const previousState = cronJob.running;

    if (time) {
      cronJob.setTime(new CronTime(time));
    }

    if (running !== undefined) {
      running ? cronJob.start() : cronJob.stop();
    } else {
      //* If running property was not updated but the time was, then the default behaviour is to set running to false
      //* To avoid this behaviour, we compare the previous state with the current one, and if they differ (the new one will always be "false", the previous could have been either of them)
      //* then we know that the previous state was "true" and we must keep it that way.
      if (cronJob.running !== previousState) {
        cronJob.start();
      }
    }

    return this.findOne(id);
  }
}
