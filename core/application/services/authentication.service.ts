import { type AuthUser, type User } from "core/entities/models/user";

export const AUTH_SERVICE = "AuthenticationService";

export const PERMISSIONS = {
  AUTH_PERMISSION: "auth-permission",
  NOT_PERMISSION: "not-permission",
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface IAuthenticationService {
  getAuthUser(): Promise<User>;

  signIn(input: AuthUser): Promise<User>;

  signOut(): Promise<boolean>;

  canPermission(slug: PermissionType): Promise<boolean>;
}
