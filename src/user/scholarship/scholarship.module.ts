import { Module } from '@nestjs/common';
import { ScholarshipsModule } from 'src/users/scholarships/scholarships.module';
//! Profiles
import './profiles/logged-in-scholarship.profile';
import { ScholarshipController } from './scholarship.controller';

@Module({
  imports: [ScholarshipsModule],
  controllers: [ScholarshipController],
})
export class ScholarshipModule {}
