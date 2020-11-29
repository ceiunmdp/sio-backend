import { BadRequestException } from '@nestjs/common';
import { TypeState } from 'typestate';

export abstract class FiniteStateMachine<T> extends TypeState.FiniteStateMachine<T> {
  constructor(startState: T) {
    super(startState);
    this.defineTransitions();
  }

  protected abstract defineTransitions(): void;

  checkTransitionIsValid(desiredState: T) {
    if (!this.canGo(desiredState)) {
      throw new BadRequestException('Transición de estado no válida.');
    }
  }
}
