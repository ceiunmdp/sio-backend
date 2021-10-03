import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import got from 'got';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { RemoveOptions } from 'src/common/interfaces/remove-options.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { buildMapBasedOnProperty } from 'src/common/utils/build-map-based-on-property';
import { filterQuery } from 'src/common/utils/query-builder';
import { FirebaseConfigService } from 'src/config/firebase/firebase-config.service';
import { CustomLoggerService } from 'src/global/custom-logger.service';
import { FirebaseErrorHandlerService } from 'src/global/firebase-error-handler.service';
import { RolesService } from 'src/roles/roles.service';
import { UserNotFoundInDatabaseException } from 'src/users/users/exceptions/user-not-found-in-database.exception';
import { DeepPartial, EntityManager, In, SelectQueryBuilder } from 'typeorm';
import { User } from './entities/user.entity';
import { UserType } from './enums/user-type.enum';
import { UserNotFoundInFirebaseException } from './exceptions/user-not-found-in-firebase.exception';
import { UsersRepository } from './users.repository';

export interface PaginationOptions {
  limit: number;
  pageToken?: string;
  route: string;
}

@Injectable()
export class UsersService implements CrudService<User> {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly firebaseConfigService: FirebaseConfigService,
    private readonly firebaseErrorHandlerService: FirebaseErrorHandlerService,
    private readonly rolesService: RolesService,
  ) {
    this.logger.context = UsersService.name;
  }

  async findAll(options: IPaginationOptions, where: Where, order: Order<User>, manager: EntityManager) {
    const usersRepository = this.getUsersRepository(manager);
    let queryBuilder = filterQuery(usersRepository.createQueryBuilder(), where);
    queryBuilder = this.addOrderByClausesToQueryBuilder(queryBuilder, order);
    const { items: users, meta, links } = await paginate(queryBuilder, options);

    //* No need to use try/catch here. Max limit will never be exceeded
    const userRecords = (await admin.auth().getUsers(users.map(({ uid }) => ({ uid })))).users;

    if (users.length === userRecords.length) {
      return new Pagination(this.mergeUserRecordsAndUsers(userRecords, users), meta, links);
    } else {
      const userRecordsMap = new Map(userRecords.map((userRecord) => [userRecord.uid, userRecord]));
      users.forEach((user) => {
        if (!userRecordsMap.has(user.uid)) throw new UserNotFoundInFirebaseException(user.uid);
      });
    }
  }

  private addOrderByClausesToQueryBuilder<T>(qb: SelectQueryBuilder<T>, order: Order<T>) {
    Object.keys(order).map((property) => {
      qb.addOrderBy(property, order[property]);
    });

    return qb;
  }

  async findAllById(ids: string[], manager: EntityManager) {
    const userIdentifiers = (await this.findUids(ids, manager)).map((uid) => ({ uid }));

    //* No need to use try/catch here. Max limit will never be exceeded
    const getUsersResult = await admin.auth().getUsers(userIdentifiers);
    return this.transformUserRecordsToUsers(getUsersResult.users, manager);
  }

  async findOne(id: string, manager: EntityManager) {
    try {
      const userRecord = await admin.auth().getUser(await this.findUid(id, manager));
      return await this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findUserRecord(uid: string) {
    try {
      return admin.auth().getUser(uid);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByUid(uid: string, manager: EntityManager) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return await this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByEmail(email: string, manager: EntityManager) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return await this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async hasEmail(email: string) {
    try {
      return !!(await admin.auth().getUserByEmail(email));
    } catch (error) {
      const exception = this.handleError(error);
      if (exception instanceof UserNotFoundInFirebaseException) {
        return false;
      } else {
        throw error;
      }
    }
  }

  async create<T extends DeepPartial<User>>(createUserDto: T, manager: EntityManager) {
    try {
      const userRecord = await admin.auth().createUser(createUserDto);

      if (!createUserDto.emailVerified) {
        await this.sendEmailVerification(userRecord.uid);
      }

      const user = await this.transformUserRecordToUser(userRecord, manager);
      await this.setRole(user, manager);
      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async sendEmailVerification(uid: string) {
    const customToken = await admin.auth().createCustomToken(uid);
    const idToken = await this.exchangeCustomTokenForIdToken(customToken);
    return this.sendEmail(idToken);
  }

  private async exchangeCustomTokenForIdToken(customToken: string) {
    const data: { idToken: string; refreshToken: string; expiresIn: string } = await got
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${this.firebaseConfigService.apiKey}`,
        {
          json: {
            token: customToken,
            returnSecureToken: true,
          },
          responseType: 'json',
        },
      )
      .json();

    return data.idToken;
  }

  private async sendEmail(idToken: string) {
    return got.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.firebaseConfigService.apiKey}`,
      {
        json: {
          requestType: 'VERIFY_EMAIL',
          idToken,
        },
        responseType: 'json',
      },
    );
  }

  async update<T extends DeepPartial<User>>(id: string, updateUserDto: T, manager: EntityManager, userIdentity: UserIdentity) {
    try {
      const user = await this.findOne(id, manager)
      await this.checkUpdateConditions(updateUserDto, user, manager, userIdentity)
      const userRecord = await admin
      .auth()
      .updateUser(user.uid, { ...updateUserDto, ...(!!updateUserDto.email && { emailVerified: false }) });
      await this.getUsersRepository(manager).updateAndReload(id, updateUserDto);
      return await this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async checkUpdateConditions<T extends DeepPartial<User>>(updateUserDto: T, user: User, _manager: EntityManager, userIdentity: UserIdentity) {
    if (user.id === userIdentity.id && updateUserDto.disabled) {
      throw new BadRequestException('No es posible deshabilitarse a sí mismo como usuario.');
    }
  }

  //! This method does not delete the user from the local database, this responsibility is from the appropiate service
  async remove(id: string, _options: RemoveOptions, manager: EntityManager) {
    try {
      return await admin.auth().deleteUser(await this.findUid(id, manager));
    } catch (error) {
      throw this.handleError(error);
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
      const usersSet = new Set(users.map((user) => user.id));
      ids.forEach((id) => {
        if (!usersSet.has(id)) throw new UserNotFoundInDatabaseException(id);
      });
    }
  }

  private async transformUserRecordToUser(userRecord: admin.auth.UserRecord, manager: EntityManager) {
    const user = await this.getUsersRepository(manager).findOne({ uid: userRecord.uid });

    if (user) {
      return this.mergeUserRecordAndUser(userRecord, user);
    } else {
      throw new UserNotFoundInDatabaseException(userRecord.uid);
    }
  }

  private async transformUserRecordsToUsers(userRecords: admin.auth.UserRecord[], manager: EntityManager) {
    const uids = userRecords.map((userRecord) => userRecord.uid);

    if (uids.length) {
      const users = await this.getUsersRepository(manager).find({ where: { uid: In(uids) } });

      if (userRecords.length === users.length) {
        return this.mergeUserRecordsAndUsers(userRecords, users);
      } else {
        const usersMap = buildMapBasedOnProperty(users, 'uid');
        userRecords.forEach((userRecord) => {
          if (!usersMap.has(userRecord.uid)) throw new UserNotFoundInDatabaseException(userRecord.uid);
        });
      }
    } else {
      return [];
    }
  }

  private mergeUserRecordAndUser(userRecord: admin.auth.UserRecord, user: User) {
    return new User({ ...user, ...userRecord });
  }

  private mergeUserRecordsAndUsers(userRecords: admin.auth.UserRecord[], users: User[]) {
    const usersMap = buildMapBasedOnProperty(users, 'uid');
    return userRecords.map((userRecord) => this.mergeUserRecordAndUser(userRecord, usersMap.get(userRecord.uid)));
  }

  async isDniRepeated(dni: string, manager: EntityManager) {
    return !!(await this.getUsersRepository(manager).findOne({ where: { dni }, withDeleted: true }));
  }

  private findUserRoleByUserType(type: UserType) {
    switch (type) {
      case UserType.ADMIN:
        return UserRole.ADMIN;
      case UserType.CAMPUS:
        return UserRole.CAMPUS;
      case UserType.PROFESSORSHIP:
        return UserRole.PROFESSORSHIP;
      case UserType.SCHOLARSHIP:
        return UserRole.SCHOLARSHIP;
      default:
        return UserRole.STUDENT;
    }
  }

  async setRole(user: User, manager: EntityManager) {
    const code = this.findUserRoleByUserType(user.type);
    user.roles = [await this.rolesService.findByCode(code, manager)];

    const updatedUser = await this.getUsersRepository(manager).updateAndReload(user.id, user);
    this.setCustomUserClaims(updatedUser, code);
    return updatedUser;
  }

  private async setCustomUserClaims({ id, uid }: User, role: UserRole) {
    const payload: UserIdentity = { id, role };

    try {
      await admin.auth().setCustomUserClaims(uid, payload);
      // await this.revokeRefreshToken(uid);
      return;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // private async revokeRefreshToken(uid: string) {
  //   try {
  //     return await admin.auth().revokeRefreshTokens(uid);
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  private handleError(error: Error) {
    if (error instanceof HttpException) {
      return error
    } else if (error instanceof Error) {
      const firebaseError = error as unknown as admin.FirebaseError;
      return this.firebaseErrorHandlerService.handleError(firebaseError);
    } else {
      return error;
    }
  }

  private getUsersRepository(manager: EntityManager) {
    return manager.getCustomRepository(UsersRepository);
  }
}
