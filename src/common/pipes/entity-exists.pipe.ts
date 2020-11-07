import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { getRepository } from 'typeorm';

@Injectable()
export class EntityExistsPipe<T> implements PipeTransform<string, Promise<string>> {
  constructor(private readonly type: new (partial: Partial<T>) => T) {}

  async transform(id: string) {
    if (await getRepository<T>(this.type).findOne(id)) {
      return id;
    } else {
      throw new NotFoundException(`${this.type.name} ${id} not found.`);
    }
  }
}
