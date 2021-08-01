import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { EntityManager } from 'typeorm';
import { CampusRepository } from './campus.repository';
import { CreateCampusDto } from './dtos/create-campus.dto';
import { PartialUpdateCampusDto } from './dtos/partial-update-campus.dto';
import { Campus } from './entities/campus.entity';

@Injectable()
export class CampusService extends GenericCrudService<Campus> {
  constructor() {
    super(Campus);
  }

  private async findCampusByName(name: string, campusRepository: CampusRepository) {
    return campusRepository.findOne({ where: { name }, withDeleted: true });
  }

  private async isNameRepeated(name: string, campusRepository: CampusRepository) {
    return !!(await this.findCampusByName(name, campusRepository));
  }

  async create(createCampusDto: CreateCampusDto, manager: EntityManager) {
    const campusRepository = this.getCampusRepository(manager);

    const campus = await this.findCampusByName(createCampusDto.name, campusRepository);
    if (!campus) {
      return campusRepository.saveAndReload(createCampusDto);
    } else if (campus.deletedAt) {
      return campusRepository.recover(campus);
    } else {
      this.throwCustomConflictException();
    }
  }

  //* update
  protected async checkUpdateConditions(
    updateCampusDto: PartialUpdateCampusDto,
    campus: Campus,
    manager: EntityManager,
  ) {
    if (
      updateCampusDto.name &&
      updateCampusDto.name != campus.name &&
      (await this.isNameRepeated(updateCampusDto.name, this.getCampusRepository(manager)))
    ) {
      this.throwCustomConflictException();
    }
  }

  //* remove
  protected async checkRemoveConditions({ id }: Campus, manager: EntityManager) {
    const course = await this.getCampusRepository(manager).findOne(id, { relations: ['campusUsers'] });

    if (course.campusUser) {
      throw new BadRequestException(
        `No es posible eliminar la sede ya que existe un usuario vinculado a la misma.`,
      );
    }
  }

  private getCampusRepository(manager: EntityManager) {
    return manager.getCustomRepository(CampusRepository);
  }

  private throwCustomConflictException() {
    throw new ConflictException('Ya existe una sede con el nombre elegido.');
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Sede ${id} no encontrada.`);
  }
}
