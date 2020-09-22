import { Injectable } from '@nestjs/common';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService extends GenericCrudService<Course> {
  constructor() {
    super(Course);
  }

  protected getCustomMessageNotFoundException(id: string): string {
    return `Materia ${id} no encontrada.`;
  }
}
