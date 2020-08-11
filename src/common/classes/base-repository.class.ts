import { DeepPartial, ObjectID, ObjectLiteral, Repository, SaveOptions } from 'typeorm';

interface IId {
  id?: string | number;
}

export abstract class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  // private _connectionName = 'default';
  // private _manager: EntityManager | undefined;

  // set manager(manager: EntityManager) {
  //   this._manager = manager;
  //   this._connectionName = manager.connection.name;
  // }

  // // Always get the entityManager from the cls namespace if active, otherwise, use the original or getManager(connectionName)
  // get manager(): EntityManager {
  //   return getEntityManagerOrTransactionManager(this._connectionName, this._manager);
  // }

  async saveAndReload<T extends DeepPartial<Entity> & IId>(entity: T, options?: SaveOptions) {
    const newEntity = await this.save(entity, options);
    return this.findOne(newEntity.id);
  }

  async updateAndReload(id: string | number | Date | ObjectID, partialEntity: DeepPartial<Entity>) {
    await this.save({ ...partialEntity, id });
    return this.findOne(id);
  }

  // async restoreAndReload(id: string | number | Date | ObjectID) {
  //   await this.restore(id);
  //   return this.findOne(id);
  // }
}
