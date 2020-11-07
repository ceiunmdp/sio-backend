import { TypeState } from 'typestate';
import { EOrderState } from '../enums/e-order-state.enum';

export class OrderFsmStaff extends TypeState.FiniteStateMachine<EOrderState> {
  constructor(startState: EOrderState) {
    super(startState);
    this.defineTransitions();
  }

  private defineTransitions() {
    this.from(EOrderState.REQUESTED, EOrderState.IN_PROCESS).to(EOrderState.CANCELLED);
    this.from(EOrderState.READY).to(EOrderState.UNDELIVERED);
    this.from(EOrderState.READY, EOrderState.UNDELIVERED).to(EOrderState.DELIVERED);
  }
}
