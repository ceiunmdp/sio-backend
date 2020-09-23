import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { EntityManager } from 'typeorm';
import { CreateRelationDto } from './dtos/create-relation.dto';
import { PartialUpdateRelationDto } from './dtos/partial-update-relation.dto';
import { Relation } from './entities/relation.entity';
import { RelationsRepository } from './relations.repository';

@Injectable()
export class RelationsService extends GenericCrudService<Relation> {
  constructor() {
    super(Relation);
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
      throw new ConflictException(this.getCustomMessageConflictException());
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
      throw new ConflictException(this.getCustomMessageConflictException());
    }
  }

  //* delete
  protected async checkDeleteConditions(relation: Relation) {
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

  private getCustomMessageConflictException() {
    return 'Ya existe una relación con el nombre elegido.';
  }

  protected getCustomMessageNotFoundException(id: string) {
    return `Relación ${id} no encontrada.`;
  }
}
