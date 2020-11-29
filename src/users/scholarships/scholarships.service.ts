import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { ParameterType } from 'src/config/parameters/enums/parameter-type.enum';
import { ParametersService } from 'src/config/parameters/parameters.service';
import { ItemsService } from 'src/items/items/items.service';
import { EntityManager } from 'typeorm';
import { StudentsRepository } from '../students/students.repository';
import { StudentsService } from '../students/students.service';
import { UserType } from '../users/enums/user-type.enum';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { PartialUpdateScholarshipDto } from './dtos/partial-update-scholarship.dto';
import { Scholarship } from './entities/scholarship.entity';
import { ScholarshipsRepository } from './scholarships.repository';

@Injectable()
export class ScholarshipsService extends GenericSubUserService<Scholarship> {
  constructor(
    usersService: UsersService,
    private readonly parametersService: ParametersService,
    @Inject(forwardRef(() => StudentsService)) private readonly studentsService: StudentsService,
    private readonly itemsService: ItemsService,
  ) {
    super(usersService, Scholarship);
  }

  //! Implemented to avoid creation of scholarships by error by other developers
  async create(): Promise<Scholarship> {
    throw new Error('Method not implemented.');
  }

  async update(
    id: string,
    updateScholarshipDto: PartialUpdateScholarshipDto,
    manager: EntityManager,
    userIdentity: UserIdentity,
  ) {
    const scholarship = await this.findOne(id, manager, userIdentity);

    await this.checkUpdateConditions(updateScholarshipDto, scholarship, manager);

    let updatedScholarship = await this.getScholarshipsRepository(manager).updateAndReload(id, updateScholarshipDto);

    if (updateScholarshipDto.type) {
      //* Degradation from scholarship to student
      await this.degradeScholarshipToStudent(id, manager);

      //? Should this line be here or, instead, make the previous method return the updated scholarship?
      updatedScholarship = { ...updatedScholarship, availableCopies: null, remainingCopies: null };
    }

    const user = await this.usersService.update(id, updateScholarshipDto, manager);
    return this.userMerger.mergeSubUser(user, updatedScholarship);
  }

  protected async checkUpdateConditions(
    updateScholarshipDto: PartialUpdateScholarshipDto,
    scholarship: Scholarship,
    manager: EntityManager,
  ) {
    if (updateScholarshipDto.remainingCopies) {
      this.checkIfRemainingCopiesSurpassesAvailableCopies(updateScholarshipDto, scholarship);
    }
    if (
      updateScholarshipDto.dni &&
      (await this.usersService.isDniRepeated(updateScholarshipDto.dni, this.usersService.getUsersRepository(manager)))
    ) {
      throw new ConflictException(`Ya existe un usuario con el dni elegido.`);
    }
  }

  private checkIfRemainingCopiesSurpassesAvailableCopies(dto: PartialUpdateScholarshipDto, scholarship: Scholarship) {
    if (
      (dto.availableCopies && dto.remainingCopies > dto.availableCopies) ||
      (!dto.availableCopies && dto.remainingCopies > scholarship.availableCopies)
    ) {
      throw new BadRequestException(
        'Las copias disponibles del becado no pueden superar el total de copias habilitadas',
      );
    }
  }

  async promoteStudentToScholarship(studentId: string, manager: EntityManager) {
    //! Raw query executed. Didn't found any other workaround
    await manager.query(`UPDATE users SET type = '${UserType.SCHOLARSHIP}' WHERE id = ?`, [studentId]);

    const initialAvailableCopies = await this.getInitialAvailableCopies(manager);
    const updatedScholarship = await this.getScholarshipsRepository(manager).updateAndReload(studentId, {
      availableCopies: initialAvailableCopies,
      remainingCopies: initialAvailableCopies,
    });

    await this.usersService.setRole(updatedScholarship, manager);
    return updatedScholarship;
  }

  private async getInitialAvailableCopies(manager: EntityManager) {
    return (await this.parametersService.findByCode(ParameterType.USERS_SCHOLARSHIPS_INITIAL_AVAILABLE_COPIES, manager))
      .value;
  }

  private async degradeScholarshipToStudent(scholarshipId: string, manager: EntityManager) {
    await this.getScholarshipsRepository(manager).update(scholarshipId, {
      availableCopies: null,
      remainingCopies: null,
    });

    //! Raw query executed. Didn't found any other workaround
    await manager.query(`UPDATE users SET type = '${UserType.STUDENT}' WHERE id = ?`, [scholarshipId]);

    const student = await manager.getCustomRepository(StudentsRepository).findOne(scholarshipId);
    await this.usersService.setRole(student, manager);
    return student;
  }

  //! Implemented to avoid deletion of scholarships by error by other developers
  async remove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async useUpRemainingCopiesAndBalance(
    numberOfSheets: number,
    amount: number,
    user: UserIdentity,
    manager: EntityManager,
  ) {
    const scholarshipsRepository = this.getScholarshipsRepository(manager);
    const scholarship = await this.findOne(user.id, manager, user);
    const remainingCopies = scholarship.remainingCopies;

    if (remainingCopies >= numberOfSheets) {
      scholarship.remainingCopies = remainingCopies - numberOfSheets;
    } else {
      scholarship.remainingCopies = 0;
      await this.studentsService.useUpBalance(user.id, amount, manager);
    }
    return scholarshipsRepository.save(scholarship);
  }

  private getScholarshipsRepository(manager: EntityManager) {
    return manager.getCustomRepository(ScholarshipsRepository);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Usuario becado ${id} no encontrado.`);
  }
}
