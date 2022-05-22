export interface OperationStatus {
  inProgress: boolean;
  success: boolean;
  error: ErrorResult | null;
}

export interface ErrorResult {
  message: string;
  devErrorMessage?: string;
  errorCode?: string;
}

export function getDefaultOperationStatus(): OperationStatus {
  return {
    inProgress: false,
    success: false,
    error: null,
  };
}
