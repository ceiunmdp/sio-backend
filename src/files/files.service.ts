import { Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Professorship } from 'src/users/professorships/entities/professorship.entity';
import { DeepPartial, EntityManager } from 'typeorm';
import { File } from './entities/file.entity';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService implements CrudService<File> {
  findAll(options: IPaginationOptions, manager: EntityManager): Promise<Pagination<File>> {
    throw new Error('Method not implemented.');
  }
  findById(id: string, manager: EntityManager): Promise<File> {
    throw new Error('Method not implemented.');
  }
  create(createDto: DeepPartial<File>, manager: EntityManager): Promise<File> {
    throw new Error('Method not implemented.');
  }
  update(id: string, updateDto: DeepPartial<File>, manager: EntityManager): Promise<File> {
    throw new Error('Method not implemented.');
  }
  delete(id: string, manager: EntityManager): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async linkFilesToProfessorship(professorship: Professorship, manager: EntityManager) {
    const filesRepository = manager.getCustomRepository(FilesRepository);

    const files = await filesRepository.find({ where: { course: { id: professorship.courseId } }, withDeleted: true });

    await Promise.all(files.map((file) => filesRepository.save({ ...file, owner: professorship })));
    await filesRepository.recover(files);
  }

  async unlinkFilesFromProfessorship(professorship: Professorship, manager: EntityManager) {
    const filesRepository = manager.getCustomRepository(FilesRepository);

    const files = await filesRepository.find({ where: { owner: { id: professorship.id } } });

    await Promise.all(files.map((file) => filesRepository.saveAndReload({ ...file, owner: null })));
    await filesRepository.softRemove(files);
  }
}
