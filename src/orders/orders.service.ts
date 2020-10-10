import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection, EntityManager } from 'typeorm';
import { FileState } from './entities/file-state.entity';
import { OrderState } from './entities/order-state.entity';
import { Order } from './entities/order.entity';
import { EFileState } from './enums/e-file-state.enum';
import { EOrderState } from './enums/e-order-state.enum';

@Injectable()
export class OrdersService extends GenericCrudService<Order> {
  constructor(@InjectConnection() connection: Connection, appConfigService: AppConfigService) {
    super(Order);
    if (!appConfigService.isProduction()) {
      this.createOrderStates(connection.manager);
      this.createFileStates(connection.manager);
    }
  }

  private async createOrderStates(manager: EntityManager) {
    const orderStatesRepository = this.getOrderStatesRepository(manager);

    if (!(await orderStatesRepository.count())) {
      return orderStatesRepository.save([
        new OrderState({ name: 'Solicitado', code: EOrderState.REQUESTED }),
        new OrderState({ name: 'En proceso', code: EOrderState.IN_PROCESS }),
        new OrderState({ name: 'Listo para retirar', code: EOrderState.READY }),
        new OrderState({ name: 'Cancelado', code: EOrderState.CANCELLED }),
        new OrderState({ name: 'No entregado', code: EOrderState.UNDELIVERED }),
        new OrderState({ name: 'Entregado', code: EOrderState.DELIVERED }),
      ]);
    }
  }

  private async createFileStates(manager: EntityManager) {
    const fileStatesRepository = this.getFileStatesRepository(manager);

    if (!(await fileStatesRepository.count())) {
      return fileStatesRepository.save([
        new FileState({ name: 'Por imprimir', code: EFileState.TO_PRINT }),
        new FileState({ name: 'Imprimiendo', code: EFileState.PRINTING }),
        new FileState({ name: 'Impreso', code: EFileState.PRINTED }),
      ]);
    }
  }

  private getOrderStatesRepository(manager: EntityManager) {
    return manager.getRepository(OrderState);
  }

  private getFileStatesRepository(manager: EntityManager) {
    return manager.getRepository(FileState);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Orden ${id} no encontrada.`);
  }
}
