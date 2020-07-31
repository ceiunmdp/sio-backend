import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateRelationDto } from './dto/create-relation.dto';
import { UpdateRelationDto } from './dto/update-relation.dto';
import { Relation } from './entities/relation.entity';

@Injectable()
export class RelationsService {
  constructor(@InjectRepository(Relation) private readonly relationsRepository: Repository<Relation>) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<Relation>> {
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
    return this.relationsRepository.save({ id, ...updateRelationDto });
  }

  async delete(id: string) {
    return await this.relationsRepository.softDelete(id);
  }
}
