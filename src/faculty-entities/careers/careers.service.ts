import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CareersRepository } from './careers.repository';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { Career } from './entities/career.entity';

@Injectable()
export class CareersService {
  constructor(private readonly careersRepository: CareersRepository) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<Career>> {
    return paginate<Career>(this.careersRepository, options);
  }

  async findById(id: string) {
    const career = await this.careersRepository.findOne(id);
    if (career) {
      return career;
    } else {
      throw new NotFoundException(`Carrera ${id} no encontrada.`);
    }
  }

  async create(createCareerDto: CreateCareerDto) {
    const career = await this.careersRepository.findOne({ where: { name: createCareerDto.name }, withDeleted: true });
    if (!career) {
      return this.careersRepository.saveAndReload(createCareerDto);
    } else if (career.deletedAt) {
      return this.careersRepository.restoreAndReload(career.id);
    } else {
      throw new ConflictException(`Ya existe una carrera con el nombre elegido.`);
    }
  }

  async update(id: string, updateCareerDto: UpdateCareerDto) {
    return this.careersRepository.updateAndReload(id, updateCareerDto);
  }

  async delete(id: string) {
    const career = await this.careersRepository.findOne(id, { relations: ['careerCourseRelations'] });
    if (career) {
      if (career.careerCourseRelations.length) {
        throw new BadRequestException(`No es posible eliminar la carrera ya que está vinculada con una o más materias`);
      } else {
        const result = await this.careersRepository.softDelete(id);
        if (result.raw.affectedRows) {
          return;
        } else {
          throw new InternalServerErrorException(`Career ${id} could not be deleted.`);
        }
      }
    } else {
      throw new NotFoundException(`Carrera ${id} no encontrada.`);
    }
  }
}
