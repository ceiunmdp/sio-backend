import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesService } from 'src/roles/roles.service';
import { Connection, EntityManager, TreeRepository } from 'typeorm';
import { Functionality } from './entities/functionality.entity';

@Injectable()
export class MenuService {
  constructor(@InjectConnection() connection: Connection, private readonly rolesService: RolesService) {
    this.createMenu(connection.manager);
  }

  async find(userRole: string, manager: EntityManager) {
    const menuRepository = manager.getTreeRepository(Functionality);

    const rootFunctionalities = await menuRepository.findRoots();
    if (rootFunctionalities.length !== 1) {
      throw new InternalServerErrorException('Menú mal configurado. Contáctese con el administrador del sistema.');
    } else {
      const menu = await menuRepository.findDescendantsTree(rootFunctionalities[0]);
      return this.cloneDeepWithFunctionalitiesAllowed(menu, userRole);
    }
  }

  private async isFunctionalityAllowed(functionality: Functionality, userRole: string) {
    const roles = await functionality.roles;
    return !!roles.find((role) => role.name === userRole);
  }

  private async cloneDeepWithFunctionalitiesAllowed(functionality: Functionality, userRole: string) {
    if (!functionality.subFunctionalities?.length) {
      // Leaf
      return (await this.isFunctionalityAllowed(functionality, userRole)) ? functionality : null;
    } else {
      // Node
      const subFunctionalities = functionality.subFunctionalities;

      const sortedSubFunctionalities = subFunctionalities
        .slice() // Copy array
        .sort((f1, f2) => f1.createDate.getTime() - f2.createDate.getTime());

      const clonedSubFunctionalities = await Promise.all(
        sortedSubFunctionalities.map((f) => this.cloneDeepWithFunctionalitiesAllowed(f, userRole)),
      );
      const filteredSubfunctionalities = clonedSubFunctionalities.filter((f) => f !== null);

      if (filteredSubfunctionalities.length) {
        functionality.subFunctionalities = filteredSubfunctionalities;
        return functionality;
      } else {
        return null;
      }
    }
  }

  // TODO: Delete this method in production
  private async createMenu(manager: EntityManager) {
    await this.rolesService.createRoles(manager);

    const menuRepository = manager.getTreeRepository(Functionality);

    const roots = await menuRepository.findRoots();
    if (!roots.length) {
      // First level
      let menu = new Functionality({ name: 'Menu' });

      // Second level
      const home = new Functionality({ name: 'Inicio', supraFunctionality: menu });
      const orders = new Functionality({ name: 'Pedidos', supraFunctionality: menu });
      const movements = new Functionality({ name: 'Movimientos', supraFunctionality: menu });
      const operations = new Functionality({ name: 'Operaciones', supraFunctionality: menu });

      // Third level
      const newOrder = new Functionality({ name: 'Nuevo pedido', supraFunctionality: orders });
      const myOrders = new Functionality({ name: 'Mis pedidos', supraFunctionality: orders });
      const myMovements = new Functionality({ name: 'Mis movimientos', supraFunctionality: movements });
      const topUp = new Functionality({ name: 'Cargar saldo', supraFunctionality: operations });
      const transferMoney = new Functionality({ name: 'Transferir dinero', supraFunctionality: operations });

      // Roles
      const admin = await this.rolesService.findByCode(UserRole.ADMIN, manager);
      const campus = await this.rolesService.findByCode(UserRole.CAMPUS, manager);
      const professorship = await this.rolesService.findByCode(UserRole.PROFESSORSHIP, manager);
      const scholarship = await this.rolesService.findByCode(UserRole.SCHOLARSHIP, manager);
      const student = await this.rolesService.findByCode(UserRole.STUDENT, manager);

      home.roles = Promise.resolve([admin, campus, professorship, scholarship, student]);
      newOrder.roles = Promise.resolve([student, scholarship]);
      myOrders.roles = Promise.resolve([campus, student, scholarship]);
      myMovements.roles = Promise.resolve([student, scholarship]);
      topUp.roles = Promise.resolve([campus]);
      transferMoney.roles = Promise.resolve([student, scholarship]);

      menu = await menuRepository.save(menu);
      await menuRepository.save([home, orders, movements, operations]);
      await menuRepository.save([newOrder, myOrders, myMovements, topUp, transferMoney]);

      return menuRepository.findDescendantsTree(menu);
    } else {
      return menuRepository.findDescendantsTree(roots[0]);
    }
  }

  private async delete(manager: EntityManager) {
    const menuRepository = manager.getTreeRepository(Functionality);

    const roots = await Promise.all(
      (await menuRepository.findRoots()).map((root) => menuRepository.findDescendantsTree(root)),
    );
    await menuRepository.createQueryBuilder().delete().from('functionalities_closure').execute();
    await Promise.all(roots.map((tree) => this.removeTree(tree, menuRepository)));
    return;
  }

  private async removeTree(functionality: Functionality, menuRepository: TreeRepository<Functionality>) {
    if (!functionality.subFunctionalities.length) {
      //! "remove" works when the native connection.transaction() is used
      return await menuRepository.remove(functionality);
    } else {
      await Promise.all(functionality.subFunctionalities.map((f) => this.removeTree(f, menuRepository)));
      return await menuRepository.remove(functionality);
    }
  }
}
