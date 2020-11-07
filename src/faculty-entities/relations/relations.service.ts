import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection, EntityManager, SelectQueryBuilder } from 'typeorm';
import { CreateRelationDto } from './dtos/create-relation.dto';
import { PartialUpdateRelationDto } from './dtos/partial-update-relation.dto';
import { Relation } from './entities/relation.entity';
import { RelationsRepository } from './relations.repository';

@Injectable()
export class RelationsService extends GenericCrudService<Relation> {
  constructor(@InjectConnection() connection: Connection, appConfigService: AppConfigService) {
    super(Relation);
    if (!appConfigService.isProduction()) {
      this.createRelations(connection.manager);
    }
  }

  private async createRelations(manager: EntityManager) {
    const relationsRepository = this.getRelationsRepository(manager);

    if (!(await relationsRepository.count())) {
      return relationsRepository.save([
        new Relation({ name: '1° Año' }),
        new Relation({ name: '2° Año' }),
        new Relation({ name: '3° Año' }),
        new Relation({ name: '4° Año' }),
        new Relation({ name: '5° Año' }),
        new Relation({ name: 'Optativas' }),
      ]);
    }
  }

  //* findAll
  protected addExtraClauses(queryBuilder: SelectQueryBuilder<Relation>) {
    return queryBuilder
      .leftJoinAndSelect(`${queryBuilder.alias}.careerCourseRelations`, 'careerCourseRelation')
      .leftJoinAndSelect('careerCourseRelation.career', 'career');
  }

  private async findRelationByName(name: string, relationsRepository: RelationsRepository) {
    return relationsRepository.findOne({ where: { name }, withDeleted: true });
  }

  private async isNameRepeated(name: string, relationsRepository: RelationsRepository) {
    return !!(await this.findRelationByName(name, relationsRepository));
  }

  async create(createRelationDto: CreateRelationDto, manager: EntityManager) {
    const relationsRepository = this.getRelationsRepository(manager);

    const relation = await this.findRelationByName(createRelationDto.name, relationsRepository);
    if (!relation) {
      return relationsRepository.saveAndReload(createRelationDto);
    } else {
      this.throwCustomConflictException();
    }
  }

  //* update
  protected async checkUpdateConditions(
    updateRelationDto: PartialUpdateRelationDto,
    _relation: Relation,
    manager: EntityManager,
  ) {
    if (
      updateRelationDto.name &&
      (await this.isNameRepeated(updateRelationDto.name, this.getRelationsRepository(manager)))
    ) {
      this.throwCustomConflictException();
    }
  }

  //* remove
  protected async checkRemoveConditions(relation: Relation) {
    if (relation.careerCourseRelations.length) {
      throw new BadRequestException(
        `No es posible eliminar la relación ya que está vinculada con carreras y materias.`,
      );
    }
  }

  private getRelationsRepository(manager: EntityManager) {
    return manager.getCustomRepository(RelationsRepository);
  }

  protected getFindOneRelations() {
    return ['careerCourseRelations'];
  }

  private throwCustomConflictException() {
    throw new ConflictException('Ya existe una relación con el nombre elegido.');
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Relación ${id} no encontrada.`);
  }
}
