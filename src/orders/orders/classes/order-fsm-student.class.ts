import { TypeState } from 'typestate';
import { EOrderState } from '../enums/e-order-state.enum';

export class OrderFsmStudent extends TypeState.FiniteStateMachine<EOrderState> {
  constructor(startState: EOrderState) {
    super(startState);
    this.defineTransitions();
  }

  private defineTransitions() {
    this.from(EOrderState.REQUESTED).to(EOrderState.CANCELLED);
  }
}
