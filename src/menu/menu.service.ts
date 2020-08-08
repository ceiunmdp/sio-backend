import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionUtil } from 'src/common/utils/transaction-util.class';
import { Role } from 'src/users/entities/role.entity';
import { Connection, EntityManager, TreeRepository } from 'typeorm';
import { Functionality } from './entities/functionality.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Functionality) private readonly menuRepository: TreeRepository<Functionality>,
    private readonly connection: Connection,
  ) {}

  async find(userRole: string) {
    const rootFunctionalities = await this.menuRepository.findRoots();
    if (rootFunctionalities.length !== 1) {
      throw new InternalServerErrorException('Menú mal configurado. Contáctese con el administrador del sistema.');
    } else {
      const menu = await this.menuRepository.findDescendantsTree(rootFunctionalities[0]);
      return this.cloneDeepWithFunctionalitiesAllowed(menu, userRole);
    }
  }

  async isFunctionalityAllowed(functionality: Functionality, userRole: string) {
    const roles = await functionality.roles;
    return !!roles.find((role) => role.name === userRole);
  }

  async cloneDeepWithFunctionalitiesAllowed(functionality: Functionality, userRole: string) {
    if (!functionality.subFunctionalities.length) {
      // Leaf
      return (await this.isFunctionalityAllowed(functionality, userRole)) ? functionality : null;
    } else {
      // Node
      const subFunctionalities = functionality.subFunctionalities;

      const sortedSubFunctionalities = subFunctionalities
        .slice()
        .sort((f1, f2) => f1.created.getTime() - f2.created.getTime());

      const clonedSubFunctionalities = await Promise.all(
        sortedSubFunctionalities.map((f) => this.cloneDeepWithFunctionalitiesAllowed(f, userRole)),
      );
      const filteredSubfunctionalities = clonedSubFunctionalities.filter((f) => f != null);

      if (filteredSubfunctionalities.length) {
        functionality.subFunctionalities = filteredSubfunctionalities;
        return functionality;
      } else {
        return null;
      }
    }
  }

  async create() {
    // First level
    let menu = new Functionality({ name: 'Menu' });

    // Second level
    const home = new Functionality({ name: 'Inicio', supraFunctionality: menu });
    const orders = new Functionality({ name: 'Pedidos', supraFunctionality: menu });
    const operations = new Functionality({ name: 'Operaciones', supraFunctionality: menu });

    // Third level
    const newOrder = new Functionality({ name: 'Nuevo pedido', supraFunctionality: orders });
    const myOrders = new Functionality({ name: 'Mis pedidos', supraFunctionality: orders });
    const depositMoney = new Functionality({ name: 'Cargar saldo', supraFunctionality: operations });
    const transferMoney = new Functionality({ name: 'Transferir dinero', supraFunctionality: operations });

    // Roles
    const admin = new Role({ name: 'admin' });
    const campus = new Role({ name: 'campus' });

    home.roles = [admin, campus];
    newOrder.roles = [admin];
    myOrders.roles = [admin, campus];
    depositMoney.roles = [admin];
    transferMoney.roles = [campus];

    menu = await this.menuRepository.save(menu);
    await this.menuRepository.save(home);
    await this.menuRepository.save(orders);
    await this.menuRepository.save(operations);
    await this.menuRepository.save(newOrder);
    await this.menuRepository.save(myOrders);
    await this.menuRepository.save(depositMoney);
    await this.menuRepository.save(transferMoney);
    return this.menuRepository.findDescendantsTree(menu);
  }

  async delete() {
    const roots = await Promise.all(
      (await this.menuRepository.findRoots()).map((root) => this.menuRepository.findDescendantsTree(root)),
    );
    return await TransactionUtil.execute(this.connection, async (manager: EntityManager) => {
      await manager.createQueryBuilder().delete().from('functionalities_closure').execute();
      await Promise.all(roots.map((tree) => this.deleteTree(manager, tree)));
      return true;
    });
  }

  async deleteTree(manager: EntityManager, functionality: Functionality) {
    if (!functionality.subFunctionalities.length) {
      return await manager.delete(Functionality, functionality.id);
    } else {
      await Promise.all(functionality.subFunctionalities.map((f) => this.deleteTree(manager, f)));
      return await manager.delete(Functionality, functionality.id);
    }
  }
}
