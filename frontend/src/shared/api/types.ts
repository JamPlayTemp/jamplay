export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
}

export const API_ERROR_CODE = {
  REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED",
  ACCESS_TOKEN_EXPIRED: "ACCESS_TOKEN_EXPIRED",
  INVALID_TOKEN: "INVALID_TOKEN",
} as const;

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
