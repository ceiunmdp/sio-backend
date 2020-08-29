import { DeepPartial, ObjectID, ObjectLiteral, Repository, SaveOptions } from 'typeorm';
import { IId } from '../interfaces/id.interface';

export abstract class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  async saveAndReload<T extends DeepPartial<Entity> & IId>(entity: T, options?: SaveOptions) {
    const newEntity = await this.save(entity, options);
    return this.findOne(newEntity.id);
  }

  async updateAndReload(id: string | number | Date | ObjectID, partialEntity: DeepPartial<Entity>) {
    await this.save({ ...partialEntity, id });
    return this.findOne(id);
  }
}
