import { BaseRepository } from 'src/common/base-classes/base-repository.repository';
import { EntityRepository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {}
