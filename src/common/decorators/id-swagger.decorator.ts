import { ApiQuery } from '@nestjs/swagger';

export const IdQuery = () =>
  ApiQuery({ name: 'id', description: 'UUID', example: '0b6071d8-ad43-464b-91e5-a3aa6dc09d68' });
