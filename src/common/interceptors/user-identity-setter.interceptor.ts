import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CreateStudentDto } from 'src/users/students/dto/create-student.dto';
import { StudentsService } from 'src/users/students/students.service';
import { User } from 'src/users/users/entities/user.entity';
import { UsersService } from 'src/users/users/users.service';
import { getManager } from 'typeorm';
import { SocketWithUserData } from '../interfaces/socket-with-user-data.interface';
import { DecodedIdToken } from '../interfaces/user-identity.interface';
import { isHttp } from '../utils/is-application-context-functions';

@Injectable()
export class UserIdentitySetterInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService, private readonly studentsService: StudentsService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const manager = getManager();
    let user: DecodedIdToken;

    if (isHttp(context)) {
      user = context.switchToHttp().getRequest<Request>().user as DecodedIdToken;
    } else {
      //* WS
      user = context.switchToWs().getClient<SocketWithUserData>().user as DecodedIdToken;
    }

    const uid = user.uid;
    const entity = await manager.findOne(User, { where: { uid } });
    if (entity) {
      user.id = entity.id;
    } else {
      const { displayName, email } = await this.usersService.findUserRecord(uid);
      const student = await this.studentsService.create(new CreateStudentDto({ uid, displayName, email }), manager);
      user.id = student.id;
    }

    return next.handle().pipe();
  }
}
