import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/users/entities/role.entity';
import { Connection, EntityManager, TreeRepository } from 'typeorm';
import { IsolationLevel } from 'typeorm-transactional-cls-hooked';
import { Functionality } from './entities/functionality.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Functionality) private readonly menuRepository: TreeRepository<Functionality>,
    @InjectConnection() private readonly connection: Connection,
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
    if (!functionality.subFunctionalities?.length) {
      // Leaf
      return (await this.isFunctionalityAllowed(functionality, userRole)) ? functionality : null;
    } else {
      // Node
      const subFunctionalities = functionality.subFunctionalities;

      const sortedSubFunctionalities = subFunctionalities
        .slice()
        .sort((f1, f2) => f1.createDate.getTime() - f2.createDate.getTime());

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
    // const home = new Functionality({ name: 'Inicio', supraFunctionality: Promise.resolve(menu) });
    const orders = new Functionality({ name: 'Pedidos', supraFunctionality: menu });
    // const orders = new Functionality({ name: 'Pedidos', supraFunctionality: Promise.resolve(menu) });
    const operations = new Functionality({ name: 'Operaciones', supraFunctionality: menu });
    // const operations = new Functionality({ name: 'Operaciones', supraFunctionality: Promise.resolve(menu) });

    // Third level
    const newOrder = new Functionality({ name: 'Nuevo pedido', supraFunctionality: orders });
    // const newOrder = new Functionality({ name: 'Nuevo pedido', supraFunctionality: Promise.resolve(orders) });
    const myOrders = new Functionality({ name: 'Mis pedidos', supraFunctionality: orders });
    // const myOrders = new Functionality({ name: 'Mis pedidos', supraFunctionality: Promise.resolve(orders) });
    const depositMoney = new Functionality({ name: 'Cargar saldo', supraFunctionality: operations });
    // const depositMoney = new Functionality({ name: 'Cargar saldo', supraFunctionality: Promise.resolve(operations) });
    const transferMoney = new Functionality({
      name: 'Transferir dinero',
      supraFunctionality: operations,
      // supraFunctionality: Promise.resolve(operations),
    });

    // Roles
    const admin = new Role({ name: 'admin' });
    const campus = new Role({ name: 'campus' });

    home.roles = [admin, campus];
    // home.roles = Promise.resolve([admin, campus]);
    newOrder.roles = [admin];
    // newOrder.roles = Promise.resolve([admin]);
    myOrders.roles = [admin, campus];
    // myOrders.roles = Promise.resolve([admin, campus]);
    depositMoney.roles = [admin];
    // depositMoney.roles = Promise.resolve([admin]);
    transferMoney.roles = [campus];
    // transferMoney.roles = Promise.resolve([campus]);

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

  //! Alternative 1
  // @Transactional({ propagation: Propagation.REQUIRED, isolationLevel: IsolationLevel.REPEATABLE_READ }) //! Defaults
  async delete() {
    const roots = await Promise.all(
      (await this.menuRepository.findRoots()).map((root) => this.menuRepository.findDescendantsTree(root)),
    );

    //! Alternative 1
    // await this.menuRepository.createQueryBuilder().delete().from('functionalities_closure').execute();
    // await Promise.all(roots.map((tree) => this.removeTree(tree)));
    // return;

    //! Alternative 2
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      const menuRepository = manager.getTreeRepository(Functionality);
      await menuRepository.createQueryBuilder().delete().from('functionalities_closure').execute();
      await Promise.all(roots.map((tree) => this.removeTree2(menuRepository, tree)));
      return;
    });

    //! Alternative 3 (recommended by NestJS)
    // return await TransactionUtil.execute(this.connection, async (manager: EntityManager) => {
    //   const menuRepository = manager.getTreeRepository(Functionality);
    //   await menuRepository.createQueryBuilder().delete().from('functionalities_closure').execute();
    //   await Promise.all(roots.map((tree) => this.removeTree2(menuRepository, tree)));
    //   return;
    // });
  }

  async removeTree(functionality: Functionality) {
    if (!functionality.subFunctionalities?.length) {
      //! Only "delete" works with @Transactional
      return await this.menuRepository.delete(functionality.id);
      // return await this.menuRepository.remove(functionality);
    } else {
      await Promise.all(functionality.subFunctionalities.map((f) => this.removeTree(f)));
      return await this.menuRepository.delete(functionality.id);
      // return await this.menuRepository.remove(functionality);
    }
  }

  async removeTree2(menuRepository: TreeRepository<Functionality>, functionality: Functionality) {
    if (!functionality.subFunctionalities.length) {
      // return await menuRepository.delete(functionality.id);
      //! "remove" works when the native connection.transaction() is used
      return await menuRepository.remove(functionality);
    } else {
      await Promise.all(functionality.subFunctionalities.map((f) => this.removeTree2(menuRepository, f)));
      // return await menuRepository.delete(functionality.id);
      return await menuRepository.remove(functionality);
    }
  }
}
