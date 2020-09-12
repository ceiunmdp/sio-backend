import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserNotFoundInDatabaseException } from 'src/common/exceptions/user-not-found-in-database.exception';
import { UserNotFoundInFirebaseException } from 'src/common/exceptions/user-not-found-in-firebase.exception';
import { Order } from 'src/common/interfaces/order.type';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { handleFirebaseError } from 'src/common/utils/firebase-handler';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { DeepPartial, EntityManager, In } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

export interface PaginationOptions {
  limit: number;
  pageToken?: string;
  route: string;
}

@Injectable()
export class UsersService implements TypeOrmCrudService<User> {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.context = UsersService.name;
  }

  async findAll(
    { limit, pageToken, route }: PaginationOptions,
    // TODO: Implement filter in this method
    // TODO: All filtered properties should exist in database
    where: Where,
    // TODO: Implement order in this method
    order: Order<User>,
    manager: EntityManager,
  ) {
    const userList = await admin.auth().listUsers(limit, pageToken?.toString());

    const numberOfUsers = await this.getUsersRepository(manager).count();

    return new Pagination<User>(
      await this.transformUserRecordsToUsers(userList.users, manager),
      {
        totalItems: numberOfUsers,
        itemCount: userList.users.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(numberOfUsers / limit),
        currentPage: null, //* Cannot use pageToken (string) here
      },
      {
        first: `${route}?limit=${limit}`,
        previous: '', //* Inaccessible
        next: userList.pageToken ? `${route}?limit=${limit}&page=${userList.pageToken}` : '',
        last: '', //* Inaccessible
      },
    );
  }

  async findAllById(ids: string[], manager: EntityManager) {
    const userIdentifiers = (await this.findUids(ids, manager)).map((uid) => ({ uid }));

    // TODO: Check if a try/catch is required here
    const getUsersResult = await admin.auth().getUsers(userIdentifiers);
    return this.transformUserRecordsToUsers(getUsersResult.users, manager);
  }

  async findById(id: string, manager: EntityManager) {
    try {
      const userRecord = await admin.auth().getUser(await this.findUid(id, manager));
      return this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }

  async findByUid(uid: string) {
    try {
      return admin.auth().getUser(uid);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }

  async findByEmail(email: string, manager: EntityManager) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }

  async hasEmail(email: string) {
    try {
      return !!(await admin.auth().getUserByEmail(email));
    } catch (error) {
      const exception = handleFirebaseError(error);
      if (exception instanceof UserNotFoundInFirebaseException) {
        return false;
      } else {
        throw error;
      }
    }
  }

  async create<T extends DeepPartial<User>>(createUserDto: T, manager: EntityManager) {
    try {
      // TODO: Decide what flow to follow: https://docs.google.com/document/d/14WzggVxA0yN99J1KxEfkE87qmjFrYFE2wLh9_jQH4I4/edit?disco=AAAAKKrQorA
      const userRecord = await admin.auth().createUser(createUserDto);
      const user = await this.transformUserRecordToUser(userRecord, manager);
      await this.setCustomUserClaims(user);
      return user;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }

  async update<T extends DeepPartial<User>>(id: string, updateUserDto: T, manager: EntityManager) {
    try {
      const uid = await this.findUid(id, manager);
      const userRecord = await admin
        .auth()
        .updateUser(uid, { ...updateUserDto, ...(!!updateUserDto.email && { emailVerified: false }) });
      await this.getUsersRepository(manager).updateAndReload(id, updateUserDto);
      return this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      // TODO: Decide if error code must be analyzed to identify source of error (user not found or other cause)
      throw handleFirebaseError(error);
    }
  }

  //! This method does not delete the user from the local database, this responsibility is from the appropiate service
  async delete(id: string, manager: EntityManager) {
    try {
      return admin.auth().deleteUser(await this.findUid(id, manager));
    } catch (error) {
      // TODO: Decide if error code must be analyzed to identify source of error (user not found or other cause)
      throw handleFirebaseError(error);
    }
  }

  private async findUid(id: string, manager: EntityManager) {
    const user = await this.getUsersRepository(manager).findOne({ id });

    if (user) {
      return user.uid;
    } else {
      throw new UserNotFoundInDatabaseException(id);
    }
  }

  private async findUids(ids: string[], manager: EntityManager) {
    const users = await this.getUsersRepository(manager).findByIds(ids);

    if (ids.length === users.length) {
      return users.map((user) => user.uid);
    } else {
      const userMap = new Map(users.map((user) => [user.id, user.uid]));
      ids.forEach((id) => {
        if (!userMap.has(id)) throw new UserNotFoundInDatabaseException(id);
      });
    }
  }

  private async transformUserRecordToUser(userRecord: admin.auth.UserRecord, manager: EntityManager) {
    const user = await this.getUsersRepository(manager).findOne({ uid: userRecord.uid });

    if (user) {
      return new User({ ...user, ...userRecord });
    } else {
      throw new UserNotFoundInDatabaseException(userRecord.uid);
    }
  }

  private async transformUserRecordsToUsers(userRecords: admin.auth.UserRecord[], manager: EntityManager) {
    const uids = userRecords.map((userRecord) => userRecord.uid);

    if (uids.length) {
      const users = await this.getUsersRepository(manager).find({ where: { uid: In(uids) } });
      const userMap = new Map(users.map((user) => [user.uid, user]));

      if (userRecords.length === users.length) {
        return userRecords.map((userRecord) => new User({ ...userMap.get(userRecord.uid), ...userRecord }));
      } else {
        userRecords.forEach((userRecord) => {
          if (!userMap.has(userRecord.uid)) throw new UserNotFoundInDatabaseException(userRecord.uid);
        });
      }
    } else {
      return [];
    }
  }

  async isDniRepeated(dni: string, usersRepository: UsersRepository) {
    return !!(await usersRepository.findOne({ where: { dni }, withDeleted: true }));
  }

  async setCustomUserClaims({ id, uid, type }: User) {
    const payload: UserIdentity = {
      id,
      role: (Object.values(UserRole) as UserRole[]).find((role) => role.toString() === type.toString()),
    };

    try {
      return admin.auth().setCustomUserClaims(uid, payload);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }

  async revokeRefreshToken(uid: string) {
    try {
      return admin.auth().revokeRefreshTokens(uid);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }

  getUsersRepository(manager: EntityManager) {
    return manager.getCustomRepository(UsersRepository);
  }
}
