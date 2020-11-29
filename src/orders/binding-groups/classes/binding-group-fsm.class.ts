import { FiniteStateMachine } from 'src/common/classes/finite-state-machine.class';
import { EBindingGroupState } from '../enums/e-binding-group-state.enum';

export class BindingGroupFsm extends FiniteStateMachine<EBindingGroupState> {
  constructor(startState: EBindingGroupState) {
    super(startState);
    this.defineTransitions();
  }

  protected defineTransitions() {
    this.from(EBindingGroupState.TO_RING).to(EBindingGroupState.RINGED);
    this.from(EBindingGroupState.RINGED).to(EBindingGroupState.TO_RING);
  }
}
