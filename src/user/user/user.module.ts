import { Module } from '@nestjs/common';
import { StudentsModule } from 'src/users/students/students.module';
import { UsersModule } from 'src/users/users/users.module';
import { UserController } from './user.controller';

@Module({
  imports: [UsersModule, StudentsModule],
  controllers: [UserController],
})
export class UserModule {}
