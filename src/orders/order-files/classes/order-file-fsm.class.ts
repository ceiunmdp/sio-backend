import { TypeState } from 'typestate';
import { EFileState } from '../enums/e-file-state.enum';

export class OrderFileFsm extends TypeState.FiniteStateMachine<EFileState> {
  constructor(startState: EFileState) {
    super(startState);
    this.defineTransitions();
  }

  private defineTransitions() {
    this.from(EFileState.TO_PRINT).to(EFileState.PRINTING);
    //? this.from(EFileState.PRINTED).to(EFileState.TO_PRINT);
  }
}
