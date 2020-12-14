import { UserType } from 'src/users/users/enums/user-type.enum';

export enum UserRole {
  ADMIN = UserType.ADMIN, // Administrador
  CAMPUS = UserType.CAMPUS, // Sede (central o anexo)
  PROFESSORSHIP = UserType.PROFESSORSHIP, // Cátedra universitaria
  SCHOLARSHIP = UserType.SCHOLARSHIP, // Usuario becado
  STUDENT = UserType.STUDENT, // Usuario estudiante
}

export const UserRoleExpanded = { ...UserRole, STUDENT: [UserRole.STUDENT, UserRole.SCHOLARSHIP] };
