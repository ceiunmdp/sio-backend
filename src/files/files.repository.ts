import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { File } from './entities/file.entity';

@EntityRepository(File)
export class FilesRepository extends BaseRepository<File> {}
