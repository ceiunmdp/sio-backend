import { FiniteStateMachine } from 'src/common/classes/finite-state-machine.class';
import { EOrderState } from '../enums/e-order-state.enum';

export class OrderFsmStaff extends FiniteStateMachine<EOrderState> {
  constructor(startState: EOrderState) {
    super(startState);
    this.defineTransitions();
  }

  protected defineTransitions() {
    this.from(EOrderState.REQUESTED, EOrderState.IN_PROCESS).to(EOrderState.CANCELLED);
    this.from(EOrderState.READY).to(EOrderState.UNDELIVERED);
    this.from(EOrderState.READY, EOrderState.UNDELIVERED).to(EOrderState.DELIVERED);
  }
}
