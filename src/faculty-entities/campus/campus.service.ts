import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { GenericCrudService } from 'src/common/classes/generic-crud.service';
import { DeepPartial, EntityManager } from 'typeorm';
import { CampusRepository } from './campus.repository';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { Campus } from './entities/campus.entity';

@Injectable()
export class CampusService extends GenericCrudService<Campus> {
  constructor() {
    super(Campus);
  }

  async create(createCampusDto: DeepPartial<CreateCampusDto>, manager: EntityManager) {
    const campusRepository = this.getCampusRepository(manager);

    const campus = await this.getCampusByName(createCampusDto.name, campusRepository);
    if (!campus) {
      return campusRepository.saveAndReload(createCampusDto);
    } else {
      if (campus.deleteDate) {
        return campusRepository.restoreAndReload(campus.id);
      } else {
        throw new ConflictException(`Ya existe una sede con el nombre elegido.`);
      }
    }
  }

  async update(id: string, updateCampusDto: DeepPartial<Campus>, manager: EntityManager) {
    const campusRepository = this.getCampusRepository(manager);
    await this.checkUpdatePreconditions(id, updateCampusDto, manager);
    return campusRepository.updateAndReload(id, updateCampusDto);
  }

  private async checkUpdatePreconditions(
    id: string,
    updateCampusDto: Partial<UpdateCampusDto>,
    manager: EntityManager,
  ) {
    const campusRepository = this.getCampusRepository(manager);

    const campus = await campusRepository.findOne(id);
    if (campus) {
      if (!!updateCampusDto.name && (await this.isNameRepeated(updateCampusDto.name, campusRepository))) {
        throw new ConflictException(`Ya existe una sede con el nombre elegido.`);
      }
      return;
    } else {
      throw new NotFoundException(`Sede ${id} no encontrada.`);
    }
  }

  getCampusRepository(manager: EntityManager) {
    return manager.getCustomRepository(CampusRepository);
  }

  private async isNameRepeated(name: string, campusRepository: CampusRepository) {
    return !!(await this.getCampusByName(name, campusRepository));
  }

  private async getCampusByName(name: string, campusRepository: CampusRepository) {
    return campusRepository.findOne({ where: { name }, withDeleted: true });
  }
}
