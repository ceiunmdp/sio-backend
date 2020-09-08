import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { GenericCrudService } from 'src/common/classes/generic-crud.service';
import { EntityManager } from 'typeorm';
import { ItemsService } from '../items/items.service';
import { BindingsRepository } from './bindings.repository';
import { CreateBindingDto } from './dtos/create-binding.dto';
import { PartialUpdateBindingDto } from './dtos/partial-update-binding.dto';
import { Binding } from './entities/binding.entity';

@Injectable()
export class BindingsService extends GenericCrudService<Binding> {
  constructor(private readonly itemsService: ItemsService) {
    super(Binding);
  }

  async create(createBindingDto: Partial<CreateBindingDto>, manager: EntityManager) {
    const bindingsRepository = this.getBindingsRepository(manager);

    const item = await this.itemsService.findItemByName(
      createBindingDto.name,
      this.itemsService.getItemsRepository(manager),
    );
    if (!item) {
      return bindingsRepository.saveAndReload(createBindingDto);
    } else {
      throw new ConflictException(this.getCustomMessageConflictException());
    }
  }

  async update(id: string, updateBindingDto: PartialUpdateBindingDto, manager: EntityManager) {
    const bindingsRepository = this.getBindingsRepository(manager);
    await this.checkUpdatePreconditions(id, updateBindingDto, manager);
    return bindingsRepository.updateAndReload(id, updateBindingDto);
  }

  private async checkUpdatePreconditions(
    id: string,
    updateBindingDto: PartialUpdateBindingDto,
    manager: EntityManager,
  ) {
    const binding = await this.getBindingsRepository(manager).findOne(id);
    if (binding) {
      if (
        !!updateBindingDto.name &&
        (await this.itemsService.isNameRepeated(updateBindingDto.name, this.itemsService.getItemsRepository(manager)))
      ) {
        throw new ConflictException(this.getCustomMessageConflictException());
      }
      return;
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  private getBindingsRepository(manager: EntityManager) {
    return manager.getCustomRepository(BindingsRepository);
  }

  private getCustomMessageConflictException() {
    return 'Ya existe una artículo con el nombre elegido.';
  }

  protected getCustomMessageNotFoundException(id: string) {
    return `Anillado ${id} no encontrado.`;
  }
}
