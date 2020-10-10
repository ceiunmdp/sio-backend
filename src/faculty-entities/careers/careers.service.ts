import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection, EntityManager, SelectQueryBuilder } from 'typeorm';
import { CareersRepository } from './careers.repository';
import { CreateCareerDto } from './dtos/create-career.dto';
import { PartialUpdateCareerDto } from './dtos/partial-update-career.dto';
import { Career } from './entities/career.entity';

@Injectable()
export class CareersService extends GenericCrudService<Career> {
  constructor(@InjectConnection() connection: Connection, appConfigService: AppConfigService) {
    super(Career);
    if (!appConfigService.isProduction()) {
      this.createCareers(connection.manager);
    }
  }

  private async createCareers(manager: EntityManager) {
    const careersRepository = this.getCareersRepository(manager);

    if (!(await careersRepository.count())) {
      return careersRepository.save([
        new Career({ name: 'Ingeniería Eléctrica' }),
        new Career({ name: 'Ingeniería Electromecánica' }),
        new Career({ name: 'Ingeniería Electrónica' }),
        new Career({ name: 'Ingeniería en Alimentos' }),
        new Career({ name: 'Ingeniería en Computación' }),
        new Career({ name: 'Ingeniería en Materiales' }),
        new Career({ name: 'Ingeniería Industrial' }),
        new Career({ name: 'Ingeniería Informática' }),
        new Career({ name: 'Ingeniería Mecánica' }),
        new Career({ name: 'Ingeniería Química' }),
      ]);
    }
  }

  //* findAll
  // TODO: Check if 'course' is necessary
  protected addExtraClauses(queryBuilder: SelectQueryBuilder<Career>) {
    return queryBuilder.leftJoinAndSelect(`${queryBuilder.alias}.careerCourseRelations`, 'careerCourseRelation');
    // .leftJoinAndSelect('careerCourseRelation.course', 'course');
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
      this.throwCustomConflictException();
    }
  }

  //* update
  protected async checkUpdateConditions(
    updateCareerDto: PartialUpdateCareerDto,
    _career: Career,
    manager: EntityManager,
  ) {
    if (updateCareerDto.name && (await this.isNameRepeated(updateCareerDto.name, this.getCareersRepository(manager)))) {
      this.throwCustomConflictException();
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

  // TODO: Check if 'course' is necessary
  protected getFindOneRelations() {
    return ['careerCourseRelations'];
    // return ['careerCourseRelations', 'careerCourseRelations.course'];
  }

  private throwCustomConflictException() {
    throw new ConflictException('Ya existe una carrera con el nombre elegido.');
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Carrera ${id} no encontrada.`);
  }
}
