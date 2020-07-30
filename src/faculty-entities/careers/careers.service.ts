import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { Career } from './entities/career.entity';

@Injectable()
export class CareersService {
  constructor(@InjectRepository(Career) private readonly careerRepository: Repository<Career>) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<Career>> {
    return paginate<Career>(this.careerRepository, options);
  }

  async findById(id: string) {
    return this.careerRepository.findOneOrFail(id);
  }

  async create(createCareerDto: CreateCareerDto) {
    const career = await this.careerRepository.findOne({ name: createCareerDto.name });
    if (!career) {
      return this.careerRepository.save(createCareerDto);
    } else {
      throw new ConflictException('Ya existe una carrera con el nombre elegido.');
    }
  }

  async update(id: string, updateCareerDto: UpdateCareerDto) {
    return this.careerRepository.save({ id, ...updateCareerDto });
  }

  async delete(id: string) {
    // TODO: Check there aren't any courses associated with it

    const result = await this.careerRepository.delete(id);
    if (result.affected) {
      return {};
    } else {
      throw new NotFoundException(`Carrera ${id} no encontrada.`);
    }
  }
}
