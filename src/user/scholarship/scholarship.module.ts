import { Module } from '@nestjs/common';
import { ScholarshipsModule } from 'src/users/scholarships/scholarships.module';
import { ScholarshipController } from './scholarship.controller';

@Module({
  imports: [ScholarshipsModule],
  controllers: [ScholarshipController],
})
export class ScholarshipModule {}
