import { DeepPartial, ObjectID, ObjectLiteral, Repository, SaveOptions } from 'typeorm';

interface IId {
  id?: string | number;
}

export class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
  async saveAndReload<T extends DeepPartial<E> & IId>(entity: T, options?: SaveOptions) {
    const newEntity = await this.save(entity, options);
    return this.findOne(newEntity.id);
  }

  async updateAndReload(id: string | number | Date | ObjectID, partialEntity: DeepPartial<E>) {
    //! "Update" method executes a primitive operation without cascades, relations and other operations included
    // await this.update(id, partialEntity);

    await this.save({ id, ...partialEntity });
    return this.findOne(id);
  }

  async restoreAndReload(id: string | number | Date | ObjectID) {
    await this.restore(id);
    return this.findOne(id);
  }
}
