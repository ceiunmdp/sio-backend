import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import bytes from 'bytes';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { Connection, EntityManager } from 'typeorm';
import { AppConfigService } from '../app/app-config.service';
import { Parameter } from './entities/parameter.entity';
import { ParameterType } from './enums/parameter-type.enum';

@Injectable()
export class ParametersService extends GenericCrudService<Parameter> implements OnModuleInit {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
  ) {
    super(Parameter);
  }

  async onModuleInit() {
    if (!this.appConfigService.isProduction()) {
      await this.createParameters(this.connection.manager);
    }
  }

  private async createParameters(manager: EntityManager) {
    const parametersRepository = this.getParametersRepository(manager);

    if (!(await parametersRepository.count())) {
      return parametersRepository.save([
        new Parameter({
          name: 'Mínimo saldo habilitado para el usuario',
          code: ParameterType.USERS_MINIMUM_BALANCE_ALLOWED,
          value: 0,
        }),
        new Parameter({
          name: 'Almacenamiento inicialmente disponible para el usuario cátedra',
          code: ParameterType.USERS_PROFESSORSHIPS_INITIAL_AVAILABLE_STORAGE,
          value: bytes('1GB'),
        }),
        new Parameter({
          name: 'Copias inicialmente disponibles para el usuario becado',
          code: ParameterType.USERS_SCHOLARSHIPS_INITIAL_AVAILABLE_COPIES,
          value: 500,
        }),
        new Parameter({
          name: 'Mínimo número de hojas requerido para poder señar un pedido',
          code: ParameterType.ORDERS_MINIMUM_NUMBER_OF_SHEETS_FOR_DEPOSIT,
          value: 200,
        }),
        new Parameter({
          name: 'Porcentaje del total del pedido que será tomado como seña',
          code: ParameterType.ORDERS_PERCENTAGE_OF_DEPOSIT,
          value: 50,
        }),
        new Parameter({
          name: 'Máximo tamaño de archivo habilitado para subir al sistema',
          code: ParameterType.FILES_MAX_SIZE_ALLOWED,
          value: bytes('100MB'),
        }),
      ]);
    }
  }

  async findByCode(code: ParameterType, manager: EntityManager) {
    const parameter = await this.getParametersRepository(manager).findOne({ where: { code } });

    if (parameter) {
      return parameter;
    } else {
      throw new NotFoundException('Parameter not found.');
    }
  }

  //! Implemented to avoid creation of parameters by error by other developers
  async create(): Promise<Parameter> {
    throw new Error('Method not implemented.');
  }

  //! Implemented to avoid deletion of parameters by error by other developers
  async remove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private getParametersRepository(manager: EntityManager) {
    return manager.getRepository(Parameter);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Parámetro ${id} no encontrado.`);
  }
}
