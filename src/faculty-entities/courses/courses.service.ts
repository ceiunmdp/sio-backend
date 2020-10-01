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
      return coursesRepository.recover(course);
    } else {
      this.throwCustomConflictException();
    }
  }

  async update(id: string, updateCourseDto: PartialUpdateCourseDto, manager: EntityManager) {
    const coursesRepository = this.getCoursesRepository(manager);

    const course = await coursesRepository.findOne(id, { relations: this.getFindOneRelations() });
    if (course) {
      await this.checkUpdateConditions(updateCourseDto, course, manager);
      await this.removeRelatedEntitiesFromTernary(course, manager);
      return coursesRepository.updateAndReload(id, {
        ...updateCourseDto,
        careerCourseRelations: this.transformRelationsToTernary(updateCourseDto.relations),
      });
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  // TODO: Temporary method. Check for future fix -> https://github.com/typeorm/typeorm/pull/6704
  private async removeRelatedEntitiesFromTernary(course: Course, manager: EntityManager) {
    const ternaryRepository = manager.getRepository(CareerCourseRelation);
    return ternaryRepository.remove(course.careerCourseRelations);
  }

  protected async checkUpdateConditions(
    updateCourseDto: PartialUpdateCourseDto,
    _course: Course,
    manager: EntityManager,
  ) {
    if (updateCourseDto.name && (await this.isNameRepeated(updateCourseDto.name, this.getCoursesRepository(manager)))) {
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

  //* delete
  protected async checkDeleteConditions({ id }: Course, manager: EntityManager) {
    const course = await this.getCoursesRepository(manager).findOne(id, { relations: ['professorship'] });

    if (course.professorship) {
      throw new BadRequestException(
        `No es posible eliminar la materia ya que existe un usuario cátedra vinculado a la misma.`,
      );
    }
  }

  //* delete
  protected async beforeDelete(course: Course, manager: EntityManager) {
    await this.removeRelatedEntitiesFromTernary(course, manager);
    await this.filesService.softRemoveByCourseId(course.id, manager);
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
