import { Serializable } from './serializable';
import { UserRole } from '../users/user-role';

export abstract class BaseSerializerService<E, T> {
  // E: Entity
  // T: Serialized value

  public abstract async serialize(entity: E, role: UserRole): Promise<T>;

  private serializeCollection(values: E[], role: UserRole): Promise<T[]> {
    return Promise.all<T>(values.map(v => this.serialize(v, role)));
  }

  public markSerializableValue(value: E): Serializable<T> {
    return new Serializable<T>(this.serialize.bind(this, value));
  }

  public markSerializableCollection(values: E[]): Serializable<T[]> {
    return new Serializable<T[]>(this.serializeCollection.bind(this, values));
  }
}
