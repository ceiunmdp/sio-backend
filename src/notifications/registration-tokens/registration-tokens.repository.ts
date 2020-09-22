import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { RegistrationToken } from './entities/registration-token.entity';

@EntityRepository(RegistrationToken)
export class RegistrationTokensRepository extends BaseRepository<RegistrationToken> {}
