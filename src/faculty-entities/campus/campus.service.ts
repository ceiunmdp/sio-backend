import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { GenericCrudService } from 'src/common/classes/generic-crud.service';
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

  async create(createCampusDto: Partial<CreateCampusDto>, manager: EntityManager) {
    const campusRepository = this.getCampusRepository(manager);

    const campus = await this.findCampusByName(createCampusDto.name, campusRepository);
    if (!campus) {
      return campusRepository.saveAndReload(createCampusDto);
    } else {
      if (campus.deleteDate) {
        return campusRepository.recover(campus);
      } else {
        throw new ConflictException(this.getCustomMessageConflictException());
      }
    }
  }

  async update(id: string, updateCampusDto: PartialUpdateCampusDto, manager: EntityManager) {
    const campusRepository = this.getCampusRepository(manager);
    await this.checkUpdatePreconditions(id, updateCampusDto, campusRepository);
    return campusRepository.updateAndReload(id, updateCampusDto);
  }

  private async checkUpdatePreconditions(
    id: string,
    updateCampusDto: PartialUpdateCampusDto,
    campusRepository: CampusRepository,
  ) {
    const campus = await campusRepository.findOne(id);
    if (campus) {
      if (!!updateCampusDto.name && (await this.isNameRepeated(updateCampusDto.name, campusRepository))) {
        throw new ConflictException(this.getCustomMessageConflictException());
      }
      return;
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  private getCampusRepository(manager: EntityManager) {
    return manager.getCustomRepository(CampusRepository);
  }

  private getCustomMessageConflictException() {
    return 'Ya existe una sede con el nombre elegido.';
  }

  protected getCustomMessageNotFoundException(id: string) {
    return `Sede ${id} no encontrada.`;
  }
}
