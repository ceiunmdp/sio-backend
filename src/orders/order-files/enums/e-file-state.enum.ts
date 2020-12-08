export enum EFileState {
  // TODO: Analyze if there are others states that should be shown to the user
  TO_PRINT = 'to_print',
  PRINTING = 'printing',
  PRINTED = 'printed',

  //* Another possible states
  // PENDING = 'pending',
  // CANCELLED = 'cancelled',
  // ABORTED = 'aborted',
}
