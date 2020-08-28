import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { CampusUser } from './entities/campus-user.entity';

@EntityRepository(CampusUser)
export class CampusUsersRepository extends BaseRepository<CampusUser> {}
