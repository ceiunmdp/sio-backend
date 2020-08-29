import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@EntityRepository(Admin)
export class AdminsRepository extends BaseRepository<Admin> {}
