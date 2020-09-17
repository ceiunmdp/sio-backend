import { Injectable } from '@nestjs/common';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { Professorship } from 'src/users/professorships/entities/professorship.entity';
import { EntityManager } from 'typeorm';
import { File } from './entities/file.entity';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService extends GenericCrudService<File> {
  constructor() {
    super(File);
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

  protected getCustomMessageNotFoundException(id: string): string {
    return `Archivo ${id} no encontrado.`;
  }
}
