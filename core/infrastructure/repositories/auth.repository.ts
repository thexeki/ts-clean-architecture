import { type ServerRequest } from "@core/entities/wrappers/server-request";
import {
  type AuthUser,
  type AuthUserValidationField,
  type JWT,
  type User,
} from "@core/entities/models/user";
import { type IAuthRepository } from "@core/application/repositories/auth.repository";
import { axiosCacheInstance, axiosInstance } from "@core/utils/axios-instance";

export class AuthRepository implements IAuthRepository {
  async signOut(): Promise<ServerRequest<boolean, string>> {
    const req =
      await axiosInstance.post<ServerRequest<boolean, string>>("/logout");
    return req.data;
  }

  async signIn(
    input: AuthUser,
  ): Promise<ServerRequest<JWT, AuthUserValidationField>> {
    const req = await axiosInstance.post<
      ServerRequest<JWT, AuthUserValidationField>
    >("/login", input);
    return req.data;
  }

  async getUserByJWT(): Promise<ServerRequest<User, string>> {
    const req =
      await axiosCacheInstance.post<ServerRequest<User, string>>("/me");
    return req.data;
  }

  async updateJWT(): Promise<ServerRequest<JWT, null>> {
    const req = await axiosInstance.post<ServerRequest<JWT, null>>("/refresh");
    return req.data;
  }
}
