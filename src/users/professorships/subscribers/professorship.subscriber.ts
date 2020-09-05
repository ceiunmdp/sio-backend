import { BadRequestException } from '@nestjs/common';
import { Professorship } from 'src/users/professorships/entities/professorship.entity';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { FilesService } from '../../../files/files.service';

@EventSubscriber()
export class ProfessorshipSubscriber implements EntitySubscriberInterface<Professorship> {
  constructor(connection: Connection, private readonly filesService: FilesService) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Professorship;
  }

  async afterInsert({ entity, manager }: InsertEvent<Professorship>) {
    this.filesService.linkFilesToProfessorship(entity, manager);
    // TODO: Update storageUsed according to the files linked.
    // TODO: If storageUsed where greater than availableStorage, make availableStorage equal to storageUsed
  }

  async beforeUpdate({ updatedColumns, entity, databaseEntity }: UpdateEvent<Professorship>) {
    if (updatedColumns.find((column) => column.propertyName === 'availableStorage')) {
      this.checkStorageUsedContraint(entity.availableStorage, databaseEntity.storageUsed);
    }
  }

  checkStorageUsedContraint(availableStorage: number, storageUsed: number) {
    if (availableStorage < storageUsed) {
      throw new BadRequestException(
        'No es posible asignar la capacidad de almacenamiento deseada ya que el usuario ha sobrepasado la misma. Intente con un valor superior.',
      );
    }
  }

  async beforeRemove({ entity, manager }: RemoveEvent<Professorship>) {
    await this.filesService.unlinkFilesFromProfessorship(entity, manager);
  }
}
