import { Injectable, NotFoundException } from '@nestjs/common';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService extends GenericCrudService<Course> {
  constructor() {
    super(Course);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Materia ${id} no encontrada.`);
  }
}
