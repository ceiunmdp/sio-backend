// import { Injectable } from '@nestjs/common';
// import { BaseSerializerService } from 'src/serialization/base-serializer.service';
// import { omit } from 'lodash';
// import { User } from './user.entity';
// import { UserRole } from './user-role';
// import { SerializedUserDTO } from './dto/serialized-user.dto';

// @Injectable()
// export class UserSerializerService extends BaseSerializerService<User, SerializedUserDTO> {
//   constructor() // private readonly articleSerializatorService: ArticleSerializatorService
//   {
//     super();
//   }

//   public async serialize(entity: User, role: UserRole): Promise<SerializedUserDTO> {
//     //* Here comes the logic of which properties to ommit based on role from user
//     console.log(entity);

//     const strippedEntity = omit(entity, ['password']);

//     // const articles = await this.articleSerializatorService.serializeCollectionForRole(
//     //   entity.charters,
//     //   role,
//     // );

//     return {
//       ...strippedEntity,
//       //   articles,
//     };
//   }
// }
