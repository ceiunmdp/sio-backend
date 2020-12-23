import { FiniteStateMachine } from 'src/common/classes/finite-state-machine.class';
import { EFileState } from '../enums/e-file-state.enum';

export class OrderFileFsm extends FiniteStateMachine<EFileState> {
  constructor(startState: EFileState) {
    super(startState);
    this.defineTransitions();
  }

  protected defineTransitions() {
    this.from(EFileState.TO_PRINT).to(EFileState.PRINTING);
    this.from(EFileState.PRINTING).to(EFileState.PRINTED);
    //? this.from(EFileState.PRINTED).to(EFileState.TO_PRINT);
  }
}
