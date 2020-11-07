import { Socket } from 'socket.io';
import { UserIdentity } from './user-identity.interface';

export interface SocketWithUserData extends Socket {
  user: UserIdentity;
}
