import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseRelationDto } from '../dto/response-relation.dto';
import { Relation } from '../entities/relation.entity';

@Profile()
export class RelationProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Relation, ResponseRelationDto, { includeBase: [BaseEntity, ResponseBaseEntity] });
  }
}
