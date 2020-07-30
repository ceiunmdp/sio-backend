import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { CareersController } from './careers/careers.controller';
import { CareersService } from './careers/careers.service';
import { Career } from './careers/entities/career.entity';
import { RelationsController } from './relations/relations.controller';
import { RelationsService } from './relations/relations.service';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([Career])],
  providers: [CareersService, RelationsService],
  controllers: [CareersController, RelationsController],
})
export class FacultyEntitiesModule {}
