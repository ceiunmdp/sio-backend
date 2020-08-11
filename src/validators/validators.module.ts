import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareersRepository } from 'src/faculty-entities/careers/careers.repository';
import { IsCareerExistValidator } from './is-career-exist';

@Module({
  imports: [TypeOrmModule.forFeature([CareersRepository])],
  providers: [IsCareerExistValidator],
  exports: [IsCareerExistValidator],
})
export class ValidatorsModule {}
