import { FiniteStateMachine } from 'src/common/classes/finite-state-machine.class';
import { EOrderState } from '../enums/e-order-state.enum';

export class OrderFsmStudent extends FiniteStateMachine<EOrderState> {
  constructor(startState: EOrderState) {
    super(startState);
    this.defineTransitions();
  }

  protected defineTransitions() {
    this.from(EOrderState.REQUESTED).to(EOrderState.CANCELLED);
  }
}
