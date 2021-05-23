import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { flatten } from 'lodash';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { FilesService } from 'src/files/files.service';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Career } from '../careers/entities/career.entity';
import { CareerCourseRelation } from '../relations/entities/career-course-relation.entity';
import { Relation } from '../relations/entities/relation.entity';
import { CoursesRepository } from './courses.repository';
import { CreateCourseRelationDto } from './dtos/create-course-relation.dto';
import { CreateCourseDto } from './dtos/create-course.dto';
import { PartialUpdateCourseDto } from './dtos/partial-update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService extends GenericCrudService<Course> {
  constructor(private readonly filesService: FilesService) {
    super(Course);
  }

  //* findAll
  protected addExtraClauses(queryBuilder: SelectQueryBuilder<Course>) {
    return queryBuilder
      .leftJoinAndSelect(`${queryBuilder.alias}.careerCourseRelations`, 'careerCourseRelation')
      .leftJoinAndSelect('careerCourseRelation.career', 'career')
      .leftJoinAndSelect('careerCourseRelation.relation', 'relation');
  }

  private async findCourseByName(name: string, coursesRepository: CoursesRepository) {
    return coursesRepository.findOne({ where: { name }, withDeleted: true });
  }

  private async isNameRepeated(name: string, coursesRepository: CoursesRepository) {
    return !!(await this.findCourseByName(name, coursesRepository));
  }

  async create(createCourseDto: CreateCourseDto, manager: EntityManager) {
    const coursesRepository = this.getCoursesRepository(manager);

    const course = await this.findCourseByName(createCourseDto.name, coursesRepository);
    if (!course) {
      return coursesRepository.saveAndReload({
        ...createCourseDto,
        careerCourseRelations: this.transformRelationsToTernary(createCourseDto.relations),
      });
    } else if (course.deleteDate) {
      //* Recover course and update its relations based on request body
      const { id } = await coursesRepository.recover(course);
      return coursesRepository.saveAndReload({
        id,
        careerCourseRelations: this.transformRelationsToTernary(createCourseDto.relations),
      });
    } else {
      this.throwCustomConflictException();
    }
  }

  async update(id: string, updateCourseDto: PartialUpdateCourseDto, manager: EntityManager) {
    const course = await this.findOne(id, manager);

    await this.checkUpdateConditions(updateCourseDto, course, manager);
    return this.getCoursesRepository(manager).updateAndReload(id, {
      ...updateCourseDto,
      careerCourseRelations: this.transformRelationsToTernary(updateCourseDto.relations),
    });
  }

  protected async checkUpdateConditions(
    updateCourseDto: PartialUpdateCourseDto,
    course: Course,
    manager: EntityManager,
  ) {
    if (
      updateCourseDto.name &&
      updateCourseDto.name != course.name &&
      (await this.isNameRepeated(updateCourseDto.name, this.getCoursesRepository(manager)))
    ) {
      this.throwCustomConflictException();
    }
  }

  private transformRelationsToTernary(relations: CreateCourseRelationDto[]) {
    return flatten(
      relations.map((relation) => relation.careersIds.map((careerId) => this.createTernary(relation.id, careerId))),
    );
  }

  private createTernary(relationId: string, careerId: string) {
    const ternary = new CareerCourseRelation({
      relation: new Relation({ id: relationId }),
      career: new Career({ id: careerId }),
    });
    return ternary;
  }

  //* remove
  protected async checkRemoveConditions({ id }: Course, manager: EntityManager) {
    const course = await this.getCoursesRepository(manager).findOne(id, { relations: ['professorship'] });

    if (course.professorship) {
      throw new BadRequestException(
        `No es posible eliminar la materia ya que existe un usuario cátedra vinculado a la misma.`,
      );
    }
  }

  //* remove
  protected async beforeRemove(course: Course, manager: EntityManager) {
    await this.removeRelatedEntitiesFromTernary(course, manager);
    await this.filesService.softRemoveByCourseId(course.id, manager);
  }

  private async removeRelatedEntitiesFromTernary(course: Course, manager: EntityManager) {
    const ternaryRepository = manager.getRepository(CareerCourseRelation);
    return ternaryRepository.remove(course.careerCourseRelations);
  }

  private getCoursesRepository(manager: EntityManager) {
    return manager.getCustomRepository(CoursesRepository);
  }

  protected getFindOneRelations() {
    return ['careerCourseRelations', 'careerCourseRelations.career', 'careerCourseRelations.relation'];
  }

  private throwCustomConflictException() {
    throw new ConflictException('Ya existe una materia con el nombre elegido.');
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Materia ${id} no encontrada.`);
  }
}
