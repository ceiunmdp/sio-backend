import { DeepPartial, ObjectLiteral, Repository, SaveOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface IId {
  id?: string | number;
}

export class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
  async saveAndReload<T extends DeepPartial<E> & IId>(entity: T, options?: SaveOptions) {
    const newEntity = await this.save(entity, options);
    return this.findOne(newEntity.id);
  }

  async updateAndReload(id: string | number, partialEntity: QueryDeepPartialEntity<E>) {
    await this.update(id, partialEntity);
    return this.findOne(id);
  }

  async restoreAndReload(id: string | number) {
    await this.restore(id);
    return this.findOne(id);
  }
}
