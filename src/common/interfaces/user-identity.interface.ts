import { admin } from 'firebase-admin/lib/auth';
import { UserRole } from '../enums/user-role.enum';

export type DecodedIdToken = admin.auth.DecodedIdToken & UserIdentity;

export interface UserIdentity {
  id: string;
  role: UserRole;
  tenant_id?: string;
}
