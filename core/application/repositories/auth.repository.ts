import { type ServerRequest } from "@core/entities/wrappers/server-request";
import {
  type AuthUser,
  type AuthUserValidationField,
  type JWT,
  type User,
} from "@core/entities/models/user";

export const AUTH_REPOSITORY = "AuthRepository";

export interface IAuthRepository {
  signOut(): Promise<ServerRequest<boolean, string>>;

  signIn(input: AuthUser): Promise<ServerRequest<JWT, AuthUserValidationField>>;

  getUserByJWT(): Promise<ServerRequest<User, string>>;

  updateJWT(): Promise<ServerRequest<JWT, null>>;
}
