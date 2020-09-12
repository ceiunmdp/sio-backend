import { UserRole } from '../enums/user-role.enum';
import { UserIdentity } from '../interfaces/user-identity.interface';

export const isAdmin = (user: UserIdentity) => user.role === UserRole.ADMIN;

export const isCampus = (user: UserIdentity) => user.role === UserRole.CAMPUS;

export const isStudent = (user: UserIdentity) => user.role === UserRole.STUDENT;

export const isScholarship = (user: UserIdentity) => user.role === UserRole.SCHOLARSHIP;

export const isStudentOrScholarship = (user: UserIdentity) => isStudent(user) || isScholarship(user);
