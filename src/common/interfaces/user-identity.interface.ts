import { admin } from 'firebase-admin/lib/auth';

export type UserIdentity = admin.auth.DecodedIdToken & CustomUserClaims;

export interface CustomUserClaims {
  id: string;
  role: string;
  tenant_id?: string;
}
