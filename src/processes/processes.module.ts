import { Module } from '@nestjs/common';
import { ScholarshipsModule } from '../users/scholarships/scholarships.module';
import { ProcessesController } from './processes.controller';
import { ProcessesService } from './processes.service';

@Module({
  imports: [ScholarshipsModule],
  controllers: [ProcessesController],
  providers: [ProcessesService],
})
export class ProcessesModule {}
