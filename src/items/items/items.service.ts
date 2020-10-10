import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection, EntityManager } from 'typeorm';
import { Item } from './entities/item.entity';
import { EItem } from './enums/e-item.enum';
import { ItemsRepository } from './items.repository';

@Injectable()
export class ItemsService extends GenericCrudService<Item> {
  constructor(@InjectConnection() connection: Connection, appConfigService: AppConfigService) {
    super(Item);
    if (!appConfigService.isProduction()) {
      this.createItems(connection.manager);
    }
  }

  async findItemByName(name: string, itemsRepository: ItemsRepository) {
    return itemsRepository.findOne({ where: { name }, withDeleted: true });
  }

  async isNameRepeated(name: string, itemsRepository: ItemsRepository) {
    return !!(await this.findItemByName(name, itemsRepository));
  }

  //! Implemented to avoid creation of items by error by other developers
  async create(): Promise<Item> {
    throw new Error('Method not implemented.');
  }

  private async createItems(manager: EntityManager) {
    const itemsRepository = manager.getRepository(Item);

    if (!(await itemsRepository.count())) {
      return itemsRepository.save([
        new Item({ name: 'Simple faz', code: EItem.SIMPLE_SIDED, price: 2 }),
        new Item({ name: 'Doble faz', code: EItem.DOUBLE_SIDED, price: 3 }),
        new Item({ name: 'Color', code: EItem.COLOUR, price: 5 }),
      ]);
    }
  }

  //! Implemented to avoid deletion of items by error by other developers
  async remove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getItemsRepository(manager: EntityManager) {
    return manager.getCustomRepository(ItemsRepository);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Item ${id} no encontrado.`);
  }
}
