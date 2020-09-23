import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
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
      this.throwCustomConflictException();
    }
  }

  //* update
  protected async checkUpdateConditions(
    updateBindingDto: PartialUpdateBindingDto,
    _binding: Binding,
    manager: EntityManager,
  ) {
    if (
      updateBindingDto.name &&
      (await this.itemsService.isNameRepeated(updateBindingDto.name, this.itemsService.getItemsRepository(manager)))
    ) {
      this.throwCustomConflictException();
    }
  }

  private getBindingsRepository(manager: EntityManager) {
    return manager.getCustomRepository(BindingsRepository);
  }

  private throwCustomConflictException() {
    throw new ConflictException('Ya existe una artículo con el nombre elegido.');
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Anillado ${id} no encontrado.`);
  }
}
