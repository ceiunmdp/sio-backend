import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { StudentsModule } from 'src/users/students/students.module';
import { MovementType } from './entities/movement-type.entity';
import { Movement } from './entities/movement.entity';
import { MovementsController } from './movements.controller';
import { MovementsRepository } from './movements.repository';
import { MovementsService } from './movements.service';
//! Profiles
import './profiles/movement.profile';

@Module({
  imports: [AppConfigModule, StudentsModule, TypeOrmModule.forFeature([Movement, MovementType, MovementsRepository])],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
