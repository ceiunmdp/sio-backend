import { DeepPartial, Repository, SaveOptions } from 'typeorm';
import { BaseEntity } from './base-entity.entity';

export abstract class BaseRepository<T extends BaseEntity> extends Repository<T> {
  async saveAndReload(entity: DeepPartial<T>, options?: SaveOptions) {
    const newEntity = await this.save(entity, options);
    return this.findOne(newEntity.id);
  }

  async updateAndReload(id: string | number, partialEntity: DeepPartial<T>) {
    await this.save({ ...partialEntity, id });
    return this.findOne(id);
  }
}
