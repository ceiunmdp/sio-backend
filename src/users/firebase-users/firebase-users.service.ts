import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FirebaseError } from 'src/common/enums/firebase-error';
import { FirebaseConfigService } from 'src/config/firebase/firebase-config.service';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PartialUpdateUserDto } from './dto/partial-update-user.dto';
import { User } from './entities/user.entity';

interface PaginationOptions {
  limit: number;
  pageToken?: string;
  route: string;
}

@Injectable()
export class FirebaseUsersService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly firebaseConfigService: FirebaseConfigService,
  ) {
    this.logger.context = FirebaseUsersService.name;
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
      this.handleFirebaseError(error, () => {
        throw new NotFoundException(`Usuario ${id} no encontrado.`);
      });
    }
  }

  async findByEmail(email: string, manager: EntityManager) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      this.handleFirebaseError(error, () => {
        throw new NotFoundException(`Usuario con email ${email} no encontrado.`);
      });
    }
  }

  async hasEmail(email: string) {
    try {
      return !!(await admin.auth().getUserByEmail(email));
    } catch (error) {
      this.handleFirebaseError(error, () => false);
    }
  }

  async create(id: string, createUserDto: CreateUserDto, manager: EntityManager) {
    try {
      // TODO: Decide what flow to follow: https://docs.google.com/document/d/14WzggVxA0yN99J1KxEfkE87qmjFrYFE2wLh9_jQH4I4/edit?disco=AAAAKKrQorA
      const userRecord = await admin.auth().createUser({ ...createUserDto, uid: id });
      // const userRecord = await admin.auth().createUser({ ...createUserDto, uid: id, emailVerified: true });
      return this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      this.handleFirebaseError(error);
    }
  }

  async update(id: string, updateUserDto: PartialUpdateUserDto, manager: EntityManager) {
    try {
      const userRecord = await admin
        .auth()
        .updateUser(id, { ...updateUserDto, ...(!!updateUserDto.email && { emailVerified: false }) });
      return this.transformUserRecordToUser(userRecord, manager);
    } catch (error) {
      // TODO: Decide if error code must be analyzed to identify source of error (user not found or other cause)
      this.handleFirebaseError(error, () => {
        throw new NotFoundException(`Usuario ${id} no encontrado.`);
      });
    }
  }

  //! This method does not delete the user from the local database, this responsibility is from the appropiate service
  async delete(id: string) {
    try {
      return admin.auth().deleteUser(id);
    } catch (error) {
      // TODO: Decide if error code must be analyzed to identify source of error (user not found or other cause)
      this.handleFirebaseError(error, () => {
        throw new NotFoundException(`Usuario ${id} no encontrado.`);
      });
    }
  }

  handleFirebaseError(error: admin.FirebaseError, callback?: () => void) {
    if (error.code === FirebaseError.USER_NOT_FOUND) {
      callback();
    } else {
      this.logFirebaseError(error);
      throw new InternalServerErrorException(
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
