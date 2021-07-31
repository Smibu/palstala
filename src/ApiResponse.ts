export type ErrorResponse = { error: string };

export type ApiResponse =
  | {
      id: string;
    }
  | ErrorResponse;
