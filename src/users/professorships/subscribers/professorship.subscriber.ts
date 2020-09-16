import { Professorship } from 'src/users/professorships/entities/professorship.entity';
import { Connection, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

@EventSubscriber()
export class ProfessorshipSubscriber implements EntitySubscriberInterface<Professorship> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Professorship;
  }
}
