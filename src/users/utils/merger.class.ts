import { EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

export class UserMerger<T extends User> {
  constructor(private readonly usersService: UsersService, private readonly type: new (partial: Partial<T>) => T) {}

  async findAndMergeSubUser(subUser: T, manager: EntityManager) {
    const user = await this.usersService.findById(subUser.id, manager);
    return this.mergeSubUser(user, subUser);
  }

  async findAndMergeSubUsers(subUsers: T[], manager: EntityManager) {
    const users = await this.usersService.findAllById(
      subUsers.map((subUser) => subUser.id),
      manager,
    );
    return this.mergeSubUsers(users, subUsers);
  }

  mergeSubUser(user: User, subUser: T) {
    return new this.type({ ...subUser, ...user });
  }

  mergeSubUsers(users: User[], subUsers: T[]) {
    return subUsers.map((subUser) =>
      this.mergeSubUser(
        users.find((user) => user.id === subUser.id),
        subUser,
      ),
    );
  }
}
