import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { flatten } from 'lodash';
import { lookup } from 'mime-types';
import { GenericInterface } from 'src/common/interfaces/generic.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { getSizeFromBase64String } from 'src/common/utils/get-size-from-base-64-string';
import { isScholarship, isStudent, isStudentOrScholarship } from 'src/common/utils/is-role-functions';
import { AppConfigService } from 'src/config/app/app-config.service';
import { CreateTemporaryFileDto } from 'src/files/dtos/create-temporary-file.dto';
import { File } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';
import { Binding } from 'src/items/bindings/entities/binding.entity';
import { Connection, EntityManager, SelectQueryBuilder } from 'typeorm';
import { isOrderFromStudent } from '../orders/utils/is-order-from-student';
import { CreateConfigurationDto } from './dtos/create/create-configuration.dto';
import { CreateOrderFileDto } from './dtos/create/create-order-file.dto';
import { BindingGroup } from './entities/binding-group.entity';
import { Configuration } from './entities/configuration.entity';
import { FileState } from './entities/file-state.entity';
import { OrderFile } from './entities/order-file.entity';
import { EFileState } from './enums/e-file-state.enum';
import { Prices } from './interfaces/prices.interface';

@Injectable()
export class OrderFilesService extends GenericCrudService<OrderFile> {
  private readonly pdfMimeType = lookup('pdf') as string;

  constructor(
    @InjectConnection() connection: Connection,
    appConfigService: AppConfigService,
    private readonly filesService: FilesService,
  ) {
    super(OrderFile);
    if (!appConfigService.isProduction()) {
      this.createFileStates(connection.manager);
    }
  }

  private async createFileStates(manager: EntityManager) {
    const fileStatesRepository = this.getFileStatesRepository(manager);

    if (!(await fileStatesRepository.count())) {
      return fileStatesRepository.save([
        new FileState({ name: 'Por imprimir', code: EFileState.TO_PRINT }),
        new FileState({ name: 'Imprimiendo', code: EFileState.PRINTING }),
        new FileState({ name: 'Impreso', code: EFileState.PRINTED }),
      ]);
    }
  }

  //* findAll
  // TODO: Throw exception when orderId does not belong to student
  protected addExtraClauses(
    queryBuilder: SelectQueryBuilder<OrderFile>,
    user: UserIdentity,
    parentCollectionIds: GenericInterface,
  ) {
    queryBuilder
      .innerJoin(`${queryBuilder.alias}.order`, 'order')
      .andWhere('order.id = :orderId', { orderId: parentCollectionIds.orderId })
      .innerJoinAndSelect(`${queryBuilder.alias}.file`, 'file')
      .innerJoinAndSelect(`${queryBuilder.alias}.state`, 'state')
      .innerJoinAndSelect(`${queryBuilder.alias}.configuration`, 'configuration')
      .leftJoinAndSelect(`${queryBuilder.alias}.bindingGroup`, 'bindingGroup');

    if (isStudent(user) || isScholarship(user)) {
      queryBuilder.andWhere('order.student_id = :studentId', { studentId: user.id });
    }

    return queryBuilder;
  }

  //* findOne // findContentById
  protected async checkFindOneConditions(orderFile: OrderFile, _manager: EntityManager, user: UserIdentity) {
    // TODO: Still remaining verify that orderFileId belongs to orderId (param)
    if (isStudentOrScholarship(user) && !isOrderFromStudent(user.id, orderFile.order)) {
      throw new ForbiddenException('Prohibido el acceso al recurso.');
    }
  }

  buildBindingGroupsMapWithNumberOfSheetsOfBG(orderFiles: CreateOrderFileDto[]) {
    const bindingGroupsMap = new Map<number, number>();

    orderFiles.forEach((orderFile) => {
      if (orderFile.bindingGroups) {
        orderFile.bindingGroups.forEach(({ id }) => {
          const numberOfSheets = orderFile.configuration.numberOfSheets;
          if (bindingGroupsMap.has(id)) {
            bindingGroupsMap.set(id, bindingGroupsMap.get(id) + numberOfSheets);
          } else {
            bindingGroupsMap.set(id, numberOfSheets);
          }
        });
      }
    });

    return bindingGroupsMap;
  }

  calculateOrderFilePrice({ copies, configuration }: CreateOrderFileDto, prices: Prices) {
    return copies * this.calculateConfigurationPrice(configuration, prices);
  }

  calculateConfigurationPrice({ colour, doubleSided, numberOfSheets }: CreateConfigurationDto, prices: Prices) {
    return (colour ? prices.colour : 1) * (doubleSided ? prices.doubleSided : prices.simpleSided) * numberOfSheets;
  }

  async buildBindingGroupsMapWithBindingGroup(
    bindingGroupsMapWithMostAppropiateBinding: Map<number, Binding>,
    manager: EntityManager,
  ) {
    const bindingGroupsRepository = this.getBindingGroupsRepository(manager);
    const bindingGroupsMapWithBindingGroup = new Map<number, BindingGroup>();

    for (const [bindingGroupId, { name, price }] of bindingGroupsMapWithMostAppropiateBinding.entries()) {
      bindingGroupsMapWithBindingGroup.set(bindingGroupId, await bindingGroupsRepository.save({ name, price }));
    }

    return bindingGroupsMapWithBindingGroup;
  }

  //! Implemented to avoid deletion of order files by error by other developers
  async create(): Promise<OrderFile> {
    throw new Error('Method not implemented.');
  }

  async createOrderFiles(
    createOrderFiles: CreateOrderFileDto[],
    bindingGroupsMap: Map<number, BindingGroup>,
    toPrintState: FileState,
    ownerId: string,
    manager: EntityManager,
  ) {
    await this.createTemporaryFiles(createOrderFiles, ownerId, manager);

    const orderFiles: OrderFile[] = [];

    for (const orderFile of createOrderFiles) {
      orderFiles.push(...(await this.createOrderFile(orderFile, toPrintState, bindingGroupsMap, manager)));
    }

    return flatten(orderFiles);
  }

  private async createTemporaryFiles(orderFiles: CreateOrderFileDto[], ownerId: string, manager: EntityManager) {
    for (const orderFile of orderFiles) {
      if (orderFile.encodedFile) {
        orderFile.fileId = (await this.createTemporaryFile(orderFile, ownerId, manager)).id;
      }
    }
  }

  private createTemporaryFile(orderFile: CreateOrderFileDto, ownerId: string, manager: EntityManager) {
    const pdf = orderFile.pdfDocument;

    return this.filesService.createTemporaryFile(
      new CreateTemporaryFileDto({
        name: orderFile.encodedFile.name,
        mimetype: this.pdfMimeType,
        numberOfSheets: pdf.getPageCount(),
        ownerId,
        size: getSizeFromBase64String(orderFile.encodedFile.content),
        content: orderFile.encodedFile.content,
      }),
      manager,
    );
  }

  private async createOrderFile(
    createOrderFile: CreateOrderFileDto,
    initialState: FileState,
    bindingGroupsMap: Map<number, BindingGroup>,
    manager: EntityManager,
  ) {
    const orderFiles: OrderFile[] = [];
    const configuration = await this.createConfiguration(createOrderFile.configuration, manager);

    for (let i = 0; i < createOrderFile.copies; i++) {
      orderFiles.push(
        new OrderFile({
          ...createOrderFile,
          file: new File({ id: createOrderFile.fileId }),
          state: initialState,
          configuration,
          ...(!!createOrderFile.bindingGroups &&
            !!createOrderFile.bindingGroups[i] && {
              bindingGroup: bindingGroupsMap.get(createOrderFile.bindingGroups[i].id),
              position: createOrderFile.bindingGroups[i].position,
            }),
        }),
      );
    }

    return orderFiles;
  }

  //! Implemented to avoid deletion of order files by error by other developers
  async remove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private createConfiguration(createConfigurationDto: CreateConfigurationDto, manager: EntityManager) {
    return manager.getRepository(Configuration).save(createConfigurationDto);
  }

  private getFileStatesRepository(manager: EntityManager) {
    return manager.getRepository(FileState);
  }

  async findFileStateByCode(code: EFileState, manager: EntityManager) {
    const state = await this.getFileStatesRepository(manager).findOne({ where: { code } });

    if (state) {
      return state;
    } else {
      throw new NotFoundException('File state not found.');
    }
  }

  private getBindingGroupsRepository(manager: EntityManager) {
    return manager.getRepository(BindingGroup);
  }

  protected getFindOneRelations(): string[] {
    return ['order', 'file', 'configuration', 'bindingGroup'];
  }

  protected throwCustomNotFoundException(id: string): void {
    throw new Error(`Pedido-archivo ${id} no encontrado.`);
  }
}
