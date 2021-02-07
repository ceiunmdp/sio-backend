import { Module } from '@nestjs/common';
import { AdminsModule } from 'src/users/admins/admins.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [AdminsModule],
  controllers: [AdminController],
})
export class AdminModule {}
