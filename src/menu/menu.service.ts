import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { sortBy } from 'lodash';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AppConfigService } from 'src/config/app/app-config.service';
import { RolesService } from 'src/roles/roles.service';
import { Connection, EntityManager, TreeRepository } from 'typeorm';
import { Functionality } from './entities/functionality.entity';
import { EFunctionality } from './enums/e-functionality.enum';

@Injectable()
export class MenuService implements OnModuleInit {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    private readonly rolesService: RolesService,
  ) {}

  async onModuleInit() {
    if (!this.appConfigService.isProduction()) {
      await this.createMenu(this.connection.manager);
    }
  }

  async find(userRole: UserRole, manager: EntityManager) {
    const menuRepository = manager.getTreeRepository(Functionality);

    const rootFunctionalities = await menuRepository.findRoots();
    if (rootFunctionalities.length !== 1) {
      throw new InternalServerErrorException('Menú mal configurado. Contáctese con el administrador del sistema.');
    } else {
      const menu = await menuRepository.findDescendantsTree(rootFunctionalities[0]);
      return this.cloneDeepWithFunctionalitiesAllowed(menu, userRole, manager);
    }
  }

  private async isFunctionalityAllowed(functionality: Functionality, userRole: UserRole, manager: EntityManager) {
    const roles = await this.rolesService.findByFunctionalityId(functionality.id, manager);
    return !!roles.find((role) => role.code === userRole);
  }

  private async cloneDeepWithFunctionalitiesAllowed(
    functionality: Functionality,
    userRole: UserRole,
    manager: EntityManager,
  ) {
    if (!functionality.subFunctionalities?.length) {
      // Leaf
      return (await this.isFunctionalityAllowed(functionality, userRole, manager)) ? functionality : null;
    } else {
      // Node
      const subFunctionalities = functionality.subFunctionalities;

      const sortedSubFunctionalities = sortBy(subFunctionalities.slice(), (functionality) => functionality.createDate);

      const clonedSubFunctionalities = await Promise.all(
        sortedSubFunctionalities.map((f) => this.cloneDeepWithFunctionalitiesAllowed(f, userRole, manager)),
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

  private async createMenu(manager: EntityManager) {
    await this.rolesService.createRoles(manager);

    const menuRepository = manager.getTreeRepository(Functionality);

    const roots = await menuRepository.findRoots();
    if (!roots.length) {
      // First level
      let menu = new Functionality({ name: 'Menu', code: EFunctionality.MENU });

      // Second level
      const home = new Functionality({ name: 'Inicio', code: EFunctionality.HOME, supraFunctionality: menu });
      const orders = new Functionality({ name: 'Pedidos', code: EFunctionality.ORDERS, supraFunctionality: menu });
      const movements = new Functionality({
        name: 'Movimientos',
        code: EFunctionality.MOVEMENTS,
        supraFunctionality: menu,
      });
      const operations = new Functionality({
        name: 'Operaciones',
        code: EFunctionality.OPERATIONS,
        supraFunctionality: menu,
      });

      // Third level
      const newOrder = new Functionality({
        name: 'Nuevo pedido',
        code: EFunctionality.NEW_ORDER,
        supraFunctionality: orders,
      });
      const myOrders = new Functionality({
        name: 'Mis pedidos',
        code: EFunctionality.MY_ORDERS,
        supraFunctionality: orders,
      });
      const myMovements = new Functionality({
        name: 'Mis movimientos',
        code: EFunctionality.MY_MOVEMENTS,
        supraFunctionality: movements,
      });
      const topUp = new Functionality({
        name: 'Cargar saldo',
        code: EFunctionality.TOP_UP,
        supraFunctionality: operations,
      });
      const transferMoney = new Functionality({
        name: 'Transferir dinero',
        code: EFunctionality.TRANSFER_MONEY,
        supraFunctionality: operations,
      });

      // Roles
      const admin = await this.rolesService.findByCode(UserRole.ADMIN, manager);
      const campus = await this.rolesService.findByCode(UserRole.CAMPUS, manager);
      const professorship = await this.rolesService.findByCode(UserRole.PROFESSORSHIP, manager);
      const scholarship = await this.rolesService.findByCode(UserRole.SCHOLARSHIP, manager);
      const student = await this.rolesService.findByCode(UserRole.STUDENT, manager);

      home.roles = [admin, campus, professorship, scholarship, student];
      newOrder.roles = [student, scholarship];
      myOrders.roles = [campus, student, scholarship];
      myMovements.roles = [student, scholarship];
      topUp.roles = [campus];
      transferMoney.roles = [student, scholarship];

      menu = await menuRepository.save(menu);
      await menuRepository.save([home, orders, movements, operations]);
      await menuRepository.save([newOrder, myOrders, myMovements, topUp, transferMoney]);

      return menuRepository.findDescendantsTree(menu);
    } else {
      return menuRepository.findDescendantsTree(roots[0]);
    }
  }

  private async remove(manager: EntityManager) {
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
