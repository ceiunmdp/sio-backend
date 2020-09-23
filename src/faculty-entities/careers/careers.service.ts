import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Course } from '../courses/entities/course.entity';
import { CareersRepository } from './careers.repository';
import { CreateCareerDto } from './dtos/create-career.dto';
import { PartialUpdateCareerDto } from './dtos/partial-update-career.dto';
import { Career } from './entities/career.entity';

@Injectable()
export class CareersService extends GenericCrudService<Career> {
  constructor() {
    super(Career);
  }

  //* findAll
  protected addExtraClauses(queryBuilder: SelectQueryBuilder<Career>) {
    queryBuilder.leftJoinAndSelect('career.careerCourseRelations', 'careerCourseRelation');
    queryBuilder.leftJoinAndSelect(Course, 'course', 'careerCourseRelation.course = course.id');
    //* All these also work
    // queryBuilder.innerJoinAndSelect(Course, 'course', 'careerCourseRelation.course.id = course.id');
    // queryBuilder.leftJoinAndSelect(Course, 'course', 'careerCourseRelation.course_id = course.id');

    return queryBuilder;
  }

  private async findCareerByName(name: string, careersRepository: CareersRepository) {
    return careersRepository.findOne({ where: { name }, withDeleted: true });
  }

  private async isNameRepeated(name: string, careersRepository: CareersRepository) {
    return !!(await this.findCareerByName(name, careersRepository));
  }

  async create(createCareerDto: CreateCareerDto, manager: EntityManager) {
    const careersRepository = this.getCareersRepository(manager);
    const career = await this.findCareerByName(createCareerDto.name, careersRepository);

    if (!career) {
      return careersRepository.saveAndReload(createCareerDto);
    } else {
      throw new ConflictException(this.getCustomMessageConflictException());
    }
  }

  //* update
  protected async checkUpdateConditions(
    updateCareerDto: PartialUpdateCareerDto,
    _career: Career,
    manager: EntityManager,
  ) {
    if (updateCareerDto.name && (await this.isNameRepeated(updateCareerDto.name, this.getCareersRepository(manager)))) {
      throw new ConflictException(this.getCustomMessageConflictException());
    }
  }

  //* delete
  protected async checkDeleteConditions(career: Career) {
    if (career.careerCourseRelations.length) {
      throw new BadRequestException(`No es posible eliminar la carrera ya que está vinculada con una o más materias.`);
    }
  }

  private getCareersRepository(manager: EntityManager) {
    return manager.getCustomRepository(CareersRepository);
  }

  protected getFindOneRelations() {
    return ['careerCourseRelations', 'careerCourseRelations.course'];
  }

  private getCustomMessageConflictException() {
    return 'Ya existe una carrera con el nombre elegido.';
  }

  protected getCustomMessageNotFoundException(id: string) {
    return `Carrera ${id} no encontrada.`;
  }
}
