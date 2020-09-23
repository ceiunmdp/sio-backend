import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RemoveOptions } from 'src/common/interfaces/remove-options.interface';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Course } from '../courses/entities/course.entity';
import { CareersRepository } from './careers.repository';
import { CreateCareerDto } from './dtos/create-career.dto';
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
    // queryBuilder.leftJoinAndSelect(Course, 'course', 'careerCourseRelation.course.id = course.id');
    // queryBuilder.leftJoinAndSelect(Course, 'course', 'careerCourseRelation.course_id = course.id');

    return queryBuilder;
  }

  //* findById
  protected getFindOneRelations() {
    return ['careerCourseRelations', 'careerCourseRelations.course'];
  }

  async create(createCareerDto: CreateCareerDto, manager: EntityManager) {
    const careersRepository = this.getCareersRepository(manager);
    const career = await careersRepository.findOne({ where: { name: createCareerDto.name }, withDeleted: true });

    if (!career) {
      return careersRepository.saveAndReload(createCareerDto);
    } else if (career.deleteDate) {
      return careersRepository.recover(career);
    } else {
      throw new ConflictException(`Ya existe una carrera con el nombre elegido.`);
    }
  }

  async delete(id: string, options: RemoveOptions, manager: EntityManager) {
    const careersRepository = this.getCareersRepository(manager);
    const career = await careersRepository.findOne(id, { relations: ['careerCourseRelations'] });

    if (career) {
      if (career.careerCourseRelations.length) {
        throw new BadRequestException(
          `No es posible eliminar la carrera ya que está vinculada con una o más materias.`,
        );
      } else {
        options?.softRemove ? await careersRepository.softRemove(career) : await careersRepository.remove(career);
        return;
      }
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  private getCareersRepository(manager: EntityManager) {
    return manager.getCustomRepository(CareersRepository);
  }

  protected getCustomMessageNotFoundException(id: string) {
    return `Carrera ${id} no encontrada.`;
  }
}
