import { UserRole } from '../enums/user-role.enum';

export class Group {
  static ADMIN = UserRole.ADMIN.toString();
  static CAMPUS = UserRole.CAMPUS.toString();
  static PROFESSORSHIP = UserRole.PROFESSORSHIP.toString();
  static SCHOLARSHIP = UserRole.SCHOLARSHIP.toString();
  static STUDENT = [UserRole.STUDENT.toString(), Group.SCHOLARSHIP];
}
