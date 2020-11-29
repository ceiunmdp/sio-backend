import { auth } from 'firebase-admin/lib/auth';
import { UserRole } from '../enums/user-role.enum';

export type DecodedIdToken = auth.DecodedIdToken & UserIdentity;

export interface UserIdentity {
  id: string;
  role: UserRole;
  tenant_id?: string;
}
