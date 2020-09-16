import { Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { RemoveOptions } from 'src/common/interfaces/remove-options.interface';
import { Where } from 'src/common/interfaces/where.type';
import { Professorship } from 'src/users/professorships/entities/professorship.entity';
import { DeepPartial, EntityManager } from 'typeorm';
import { File } from './entities/file.entity';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService implements CrudService<File> {
  findAll(
    options: IPaginationOptions,
    where: Where,
    order: Order<File>,
    manager?: EntityManager,
  ): Promise<Pagination<File>> {
    throw new Error('Method not implemented.');
  }
  findById(id: string, manager?: EntityManager): Promise<File> {
    throw new Error('Method not implemented.');
  }
  create(createDto: DeepPartial<File>, manager?: EntityManager): Promise<File> {
    throw new Error('Method not implemented.');
  }
  update(id: string, updateDto: DeepPartial<File>, manager?: EntityManager): Promise<File> {
    throw new Error('Method not implemented.');
  }
  delete(id: string, options?: RemoveOptions, manager?: EntityManager): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async linkFilesToProfessorship(professorship: Professorship, manager: EntityManager) {
    const filesRepository = this.getFilesRepository(manager);

    const files = await filesRepository.find({ where: { course: { id: professorship.courseId } }, withDeleted: true });
    files.forEach((file) => (file.owner = professorship));
    await filesRepository.save(files);

    return filesRepository.recover(files);
  }

  async unlinkFilesFromProfessorship(professorship: Professorship, manager: EntityManager) {
    const filesRepository = this.getFilesRepository(manager);

    const files = await filesRepository.find({ where: { owner: { id: professorship.id } } });
    files.forEach((file) => (file.owner = null));
    await filesRepository.save(files);

    await filesRepository.softRemove(files);
  }

  private getFilesRepository(manager: EntityManager) {
    return manager.getCustomRepository(FilesRepository);
  }
}
