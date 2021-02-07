import { Module } from '@nestjs/common';
import { ProfessorshipsModule } from 'src/users/professorships/professorships.module';
import { ProfessorshipController } from './professorship.controller';

@Module({
  imports: [ProfessorshipsModule],
  controllers: [ProfessorshipController],
})
export class ProfessorshipModule {}
