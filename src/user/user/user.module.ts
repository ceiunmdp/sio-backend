import { Module } from '@nestjs/common';
import { StudentsModule } from 'src/users/students/students.module';
import { UsersModule } from 'src/users/users/users.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UsersModule, StudentsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
