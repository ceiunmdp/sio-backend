import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user-role.enum';
import { EntityManager } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  // TODO: Delete this method in production
  async createRoles(manager: EntityManager) {
    const rolesRepository = manager.getRepository(Role);

    if (!(await rolesRepository.count())) {
      return rolesRepository.save([
        new Role({ name: 'Administrador', code: UserRole.ADMIN }),
        new Role({ name: 'Sede', code: UserRole.CAMPUS }),
        new Role({ name: 'Cátedra', code: UserRole.PROFESSORSHIP }),
        new Role({ name: 'Estudiante', code: UserRole.STUDENT }),
        new Role({ name: 'Becado', code: UserRole.SCHOLARSHIP }),
      ]);
    }
  }

  async findByCode(code: UserRole, manager: EntityManager) {
    const rolesRepository = manager.getRepository(Role);

    const role = rolesRepository.findOne({ where: { code } });
    if (role) {
      return role;
    } else {
      throw new NotFoundException('Role not found.');
    }
  }

  async findByFunctionalityId(functionalityId: string, manager: EntityManager) {
    return manager
      .getRepository(Role)
      .createQueryBuilder('role')
      .innerJoin('role.functionalities', 'functionalities')
      .where('functionalities.id = :functionalityId', { functionalityId })
      .getMany();
  }
}
