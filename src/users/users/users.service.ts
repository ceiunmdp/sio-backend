import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FirebaseError } from 'src/common/enums/firebase-error';
import { EmailAlreadyExistsException } from 'src/common/exceptions/email-already-exists.exception';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { DeepPartial, EntityManager } from 'typeorm';
import { User } from './entities/user.entity';

export interface PaginationOptions {
  limit: number;
  pageToken?: string;
  route: string;
}

@Injectable()
export class UsersService {
  // TODO: Implement interface
  // implements CrudService<User> {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.context = UsersService.name;
  }

  async findAll({ limit, pageToken, route }: PaginationOptions, manager: EntityManager) {
    const userList = await admin.auth().listUsers(limit, pageToken?.toString());

    const numberOfUsers = await manager.getRepository(User).count();

    return new Pagination<User>(
      await Promise.all(this.transformUserRecordsToUsers(userList.users, manager)),
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
    const userIdentifiers = ids.map((id) => {
      return {
        uid: id,
      };
    });

    // TODO: Check if a try/catch is required here
    const getUsersResult = await admin.auth().getUsers(userIdentifiers);
    return Promise.all(this.transformUserRecordsToUsers(getUsersResult.users, manager));
  }

  async findById(id: string, manager: EntityManager) {
    try {
      const userRecord = await admin.auth().getUser(id);
      return this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      const exception = this.handleFirebaseError(error);
      if (exception instanceof UserNotFoundException) {
        throw new NotFoundException(`Usuario ${id} no encontrado.`);
      } else {
        throw error;
      }
    }
  }

  async findByEmail(email: string, manager: EntityManager) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      const exception = this.handleFirebaseError(error);
      if (exception instanceof UserNotFoundException) {
        throw new NotFoundException(`Usuario con email ${email} no encontrado.`);
      } else {
        throw error;
      }
    }
  }

  async hasEmail(email: string) {
    try {
      return !!(await admin.auth().getUserByEmail(email));
    } catch (error) {
      const exception = this.handleFirebaseError(error);
      if (exception instanceof UserNotFoundException) {
        return false;
      } else {
        throw error;
      }
    }
  }

  async create<T extends DeepPartial<User>>(id: string, createDto: T, manager: EntityManager) {
    try {
      // TODO: Decide what flow to follow: https://docs.google.com/document/d/14WzggVxA0yN99J1KxEfkE87qmjFrYFE2wLh9_jQH4I4/edit?disco=AAAAKKrQorA
      const userRecord = await admin.auth().createUser({ ...createDto, uid: id });
      // const userRecord = await admin.auth().createUser({ ...createUserDto, uid: id, emailVerified: true });

      const user = await this.transformUserRecordToUser(userRecord, manager);
      await this.setCustomUserClaims(user);
      return user;
    } catch (error) {
      throw this.handleFirebaseError(error);
    }
  }

  async update<T extends DeepPartial<User>>(id: string, updateDto: T, manager: EntityManager) {
    try {
      const userRecord = await admin
        .auth()
        .updateUser(id, { ...updateDto, ...(!!updateDto.email && { emailVerified: false }) });
      return this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      // TODO: Decide if error code must be analyzed to identify source of error (user not found or other cause)
      const exception = this.handleFirebaseError(error);
      if (exception instanceof UserNotFoundException) {
        throw new NotFoundException(`Usuario ${id} no encontrado.`);
      } else {
        throw error;
      }
    }
  }

  //! This method does not delete the user from the local database, this responsibility is from the appropiate service
  async delete(id: string) {
    try {
      return admin.auth().deleteUser(id);
    } catch (error) {
      // TODO: Decide if error code must be analyzed to identify source of error (user not found or other cause)
      const exception = this.handleFirebaseError(error);
      if (exception instanceof UserNotFoundException) {
        throw new NotFoundException(`Usuario ${id} no encontrado.`);
      } else {
        throw error;
      }
    }
  }

  handleFirebaseError(error: admin.FirebaseError) {
    switch (error.code) {
      case FirebaseError.USER_NOT_FOUND:
        return new UserNotFoundException();
      case FirebaseError.EMAIL_ALREADY_EXISTS:
        return new EmailAlreadyExistsException();
      default:
        this.logFirebaseError(error);
        return new InternalServerErrorException(
          'Problema con proveedor externo. Consulte con el administrador del sistema.',
        );
    }
  }

  logFirebaseError(error: admin.FirebaseError) {
    this.logger.error(`Firebase Error.\nCode: ${error.code}\nMessage: ${error.message}`);
  }

  async transformUserRecordToUser(userRecord: admin.auth.UserRecord, manager: EntityManager) {
    const user = await manager.getRepository(User).findOne({ id: userRecord.uid });

    if (user) {
      return new User({ ...user, ...userRecord });
    } else {
      throw new NotFoundException(`Usuario ${userRecord.uid} no encontrado en base local.`);
    }
  }

  transformUserRecordsToUsers(userRecords: admin.auth.UserRecord[], manager: EntityManager) {
    return userRecords.map((userResult) => this.transformUserRecordToUser(userResult, manager));
  }

  async setCustomUserClaims({ id, type }: User) {
    const payload: UserIdentity = {
      id,
      role: type,
    };

    return admin.auth().setCustomUserClaims(id, payload);
  }

  // async sendEmailVerification(id: string) {
  //   const idToken = await admin.auth().createCustomToken(id);
  //   const { body } = await got.post(
  //     `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.firebaseConfigService.apiKey}`,
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       json: {
  //         requestType: 'VERIFY_EMAIL',
  //         idToken: idToken,
  //       },
  //     },
  //   );
  //   return body;
  // }
}
