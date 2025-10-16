export interface GameOptions {
  answerElimination: AnswerEliminationOptions;
}

export interface AnswerEliminationOptions {
  enabled: boolean;
  intervalSeconds: 3 | 5 | 10;
  eliminateToCount: 2 | 3 | number;
  showWarning: boolean;
}

export interface EliminationState {
  isActive: boolean;
  timerId: number | null;
  nextEliminationTime: number;
  eliminatedAnswers: string[];
  availableForElimination: string[];
}

export interface GameOptionsValidationError {
  field: string;
  message: string;
}
