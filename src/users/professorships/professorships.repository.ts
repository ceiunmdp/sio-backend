import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Professorship } from './entities/professorship.entity';

@EntityRepository(Professorship)
export class ProfessorshipsRepository extends BaseRepository<Professorship> {}
