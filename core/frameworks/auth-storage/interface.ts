export const AUTH_STORAGE = "AuthStorage";

export interface IAuthStorage {
  setTokens(accessToken: string, expiresIn: number): void;

  getAccessToken(): Promise<string | null>;

  removeTokens(): void;
}
