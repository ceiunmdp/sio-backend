import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Order as Sort } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { isAdmin, isCampus, isStudentOrScholarship } from 'src/common/utils/is-role-functions';
import { filterQuery } from 'src/common/utils/query-builder';
import { Order } from 'src/orders/entities/order.entity';
import { StudentsService } from 'src/users/students/students.service';
import { User } from 'src/users/users/entities/user.entity';
import { Brackets, EntityManager, SelectQueryBuilder } from 'typeorm';
import { CreateMovementDto } from './dtos/create-movement.dto';
import { MovementType } from './entities/movement-type.entity';
import { Movement } from './entities/movement.entity';
import { EMovementType } from './enums/e-movement-type.enum';
import { MovementsRepository } from './movements.repository';

@Injectable()
export class MovementsService extends GenericCrudService<Movement> {
  constructor(private readonly studentsService: StudentsService) {
    super(Movement);
  }

  async findAll(
    options: IPaginationOptions,
    where: Where,
    order: Sort<Movement>,
    manager: EntityManager,
    user?: UserIdentity,
  ) {
    const movementsRepository = this.getMovementsRepository(manager);
    let queryBuilder = filterQuery(movementsRepository.createQueryBuilder('movements'), where);
    queryBuilder = this.addExtraClauses(queryBuilder, user);
    queryBuilder = this.addOrderByClausesToQueryBuilder(queryBuilder, order);
    const { items, meta, links } = await paginate(queryBuilder, options);

    return new Pagination(
      items.map((movement) => this.convertSourceAndTargetToUser(movement)),
      meta,
      links,
    );
  }

  private convertSourceAndTargetToUser(movement: Movement) {
    // TODO: Caveat! The resulting user is missing all properties from Firebase database (for now it's only the email)
    return new Movement({ ...movement, source: new User(movement.source), target: new User(movement.target) });
  }

  protected addExtraClauses(queryBuilder: SelectQueryBuilder<Movement>, user: UserIdentity) {
    queryBuilder.innerJoinAndSelect('movements.source', 'source');
    queryBuilder.innerJoinAndSelect('movements.target', 'target');
    queryBuilder.innerJoinAndSelect('movements.type', 'type');

    if (user && user.role !== UserRole.ADMIN) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('source_user_id = :sourceId', { sourceId: user.id }).orWhere('target_user_id = :targetId', {
            targetId: user.id,
          });
        }),
      );
    }
    return queryBuilder;
  }

  async findById(id: string, manager: EntityManager, user: UserIdentity) {
    const movementsRepository = this.getMovementsRepository(manager);
    const movement = await movementsRepository.findOne(id, {
      loadEagerRelations: true,
      relations: ['source', 'target'],
    });

    if (movement) {
      if (!isAdmin(user)) {
        if (this.isMovementFromUser(movement, user.id)) {
          return this.convertSourceAndTargetToUser(movement);
        } else {
          throw new ForbiddenException(`El movimiento ${id} no pertenece al usuario.`);
        }
      } else {
        return movement;
      }
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  private isMovementFromUser(movement: Movement, userId: string) {
    return movement.source.id === userId || movement.target.id === userId;
  }

  async create(createMovementDto: CreateMovementDto, manager: EntityManager, user: UserIdentity) {
    if (createMovementDto.type.code === EMovementType.TRANSFER) {
      this.checkTransferRequirements(createMovementDto, user);
      return this.createTransferMovement(createMovementDto, manager);
    } else {
      //* EmovementType.TOP_UP
      this.checkTopUpRequirements(createMovementDto, user);
      return this.createTopUpMovement(createMovementDto, manager);
    }
  }

  private checkTransferRequirements(createMovementDto: CreateMovementDto, user: UserIdentity) {
    if (!isStudentOrScholarship(user)) {
      throw new ForbiddenException(`Operación no permitida para el usuario.`);
    } else if (createMovementDto.sourceId !== user.id) {
      throw new BadRequestException(
        `Id del usuario origen incorrecto. El id debe corresponder al propio estudiante que pretende realizar la transferencia.`,
      );
    } else if (createMovementDto.targetId === user.id) {
      throw new BadRequestException(`Id del usuario destino no puede ser el propio usuario.`);
    }
  }

  private checkTopUpRequirements(createMovementDto: CreateMovementDto, user: UserIdentity) {
    if (!isCampus(user)) {
      throw new ForbiddenException(`Operación no permitida para el usuario.`);
    } else if (createMovementDto.sourceId !== user.id) {
      throw new BadRequestException(
        `Id del usuario origen incorrecto. El id debe corresponder a la sede a partir de la cual se realiza la carga de saldo.`,
      );
    }
  }

  private async createMovement(createMovementDto: CreateMovementDto, manager: EntityManager) {
    const movementsRepository = this.getMovementsRepository(manager);
    const movementTypesRepository = this.getMovementTypesRepository(manager);

    const movementType = await movementTypesRepository.findOne({ where: { code: createMovementDto.type.code } });
    return movementsRepository.saveAndReload({
      ...createMovementDto,
      source: new User({ id: createMovementDto.sourceId }),
      target: new User({ id: createMovementDto.targetId }),
      type: movementType,
    });
  }

  private async createTransferMovement(createMovementDto: CreateMovementDto, manager: EntityManager) {
    const newMovement = await this.createMovement(createMovementDto, manager);

    try {
      await this.studentsService.useUpBalance(createMovementDto.sourceId, createMovementDto.amount, manager);
      await this.studentsService.topUpBalance(createMovementDto.targetId, createMovementDto.amount, manager);
      return newMovement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Id del usuario origen o destino no corresponse a un estudiante.`);
      } else {
        throw error;
      }
    }
  }

  private async createTopUpMovement(createMovementDto: CreateMovementDto, manager: EntityManager) {
    const newMovement = await this.createMovement(createMovementDto, manager);

    try {
      await this.studentsService.topUpBalance(createMovementDto.targetId, createMovementDto.amount, manager);
      return newMovement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Id del usuario destino no corresponse a un estudiante.`);
      } else {
        throw error;
      }
    }
  }

  async createNewOrderMovement(order: Order, manager: EntityManager) {
    const movementsRepository = this.getMovementsRepository(manager);
    const movementTypesRepository = this.getMovementTypesRepository(manager);

    const movementType = await movementTypesRepository.findOne({ where: { code: EMovementType.ORDER_PLACED } });
    return movementsRepository.saveAndReload({
      source: new User({ id: order.student.id }),
      target: new User({ id: order.campus.id }),
      type: movementType,
      amount: order.total,
    });
  }

  private getMovementsRepository(manager: EntityManager) {
    return manager.getCustomRepository(MovementsRepository);
  }

  private getMovementTypesRepository(manager: EntityManager) {
    return manager.getRepository(MovementType);
  }

  protected getCustomMessageNotFoundException(id: string): string {
    return `Movimiento ${id} no encontrado.`;
  }
}
