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

  async findById(id: string) {
    try {
      const cronJob = this.schedulerRegistry.getCronJob(id);
      return this.createTask(id, cronJob);
    } catch (error) {
      throw new NotFoundException(`Tarea '${id}' no encontrada.`);
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
    const cronJob = (await this.findById(id)).cronJob;
    const previousState = cronJob.running;

    if (time) {
      cronJob.setTime(new CronTime(time));
    }

    if (running !== undefined) {
      running ? cronJob.start() : cronJob.stop();
    } else {
      if (cronJob.running !== previousState) {
        cronJob.start();
      }
    }

    return this.findById(id);
  }
}
