import { isArray } from 'lodash';
import { DeepPartial, Repository, SaveOptions } from 'typeorm';
import { BaseEntity } from './base-entity.entity';

export abstract class BaseRepository<T extends BaseEntity> extends Repository<T> {
  async saveAndReload(entity: DeepPartial<T>, relations?: string[], options?: SaveOptions): Promise<T>;
  async saveAndReload(entities: DeepPartial<T>[], relations?: string[], options?: SaveOptions): Promise<T[]>;
  async saveAndReload(
    entities: DeepPartial<T> | DeepPartial<T>[],
    relations?: string[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    if (isArray(entities)) {
      const newEntities = await this.save(entities, options);
      return this.findByIds(
        newEntities.map((entity) => entity.id),
        { relations, loadEagerRelations: true },
      );
    } else {
      const newEntity = await this.save(entities, options);
      return this.findOne(newEntity.id, { relations, loadEagerRelations: true });
    }
  }

  async updateAndReload(id: string | number, partialEntity: DeepPartial<T>, relations?: string[]) {
    await this.save({ ...partialEntity, id });
    return this.findOne(id, { relations, loadEagerRelations: true });
  }
}
