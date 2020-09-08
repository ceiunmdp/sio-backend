import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateRelationDto } from './dtos/create-relation.dto';
import { UpdateRelationDto } from './dtos/update-relation.dto';
import { Relation } from './entities/relation.entity';

@Injectable()
export class RelationsService {
  constructor(@InjectRepository(Relation) private readonly relationsRepository: Repository<Relation>) {}

  async findAll(options: IPaginationOptions) {
    return paginate<Relation>(this.relationsRepository, options);
  }

  async findById(id: string) {
    return this.relationsRepository.findOneOrFail(id);
  }

  async create(createRelationDto: CreateRelationDto) {
    const relation = await this.relationsRepository.findOne({ name: createRelationDto.name });
    if (!relation) {
      return this.relationsRepository.save(createRelationDto);
    } else {
      throw new ConflictException('Ya existe una relación con el nombre elegido.');
    }
  }

  async update(id: string, updateRelationDto: UpdateRelationDto) {
    // TODO: Call "saveAndReload"
    return this.relationsRepository.save({ ...updateRelationDto, id });
  }

  async delete(id: string) {
    // TODO: Implement "softRemove"
    return await this.relationsRepository.softDelete(id);
  }
}
