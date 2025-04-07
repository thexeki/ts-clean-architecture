import {
  authSchema,
  type AuthUser,
  jwtSchema,
  type User,
  userSchema,
} from "@core/entities/models/user";
import { ServerRequestHandle } from "@core/entities/wrappers/server-request";
import { type IAuthStorage } from "@core/frameworks/auth-storage/interface";
import {
  type IAuthenticationService,
  type PermissionType,
} from "@core/application/services/authentication.service";
import { type IAuthRepository } from "@core/application/repositories/auth.repository";
import { MetaError } from "@core/entities/errors/meta";
import { UnauthenticatedError } from "@core/entities/errors/auth";
import { z } from "zod";
import { AuthUserValidationError } from "@core/entities/errors/valid";

export class AuthenticationService implements IAuthenticationService {
  constructor(
    private userRepository: IAuthRepository,
    private authStorage: IAuthStorage,
  ) {}

  async getAuthUser(): Promise<User> {
    const accessToken = await this.authStorage.getAccessToken();
    if (!accessToken)
      throw new UnauthenticatedError("Токен авторизации отсутствует");

    const handler = new ServerRequestHandle(userSchema, jwtSchema);
    const { data, error } = await handler.fetch(
      this.userRepository.getUserByJWT(),
    );
    if (error) {
      const tokenHandler = new ServerRequestHandle(jwtSchema, jwtSchema);
      const { data: dataTokenRef, error: errorTokenRef } =
        await tokenHandler.fetch(this.userRepository.updateJWT());
      if (errorTokenRef) throw errorTokenRef;

      const tokenRef = dataTokenRef.get;
      this.authStorage.setTokens(tokenRef.access_token, tokenRef.expires_in);

      const { data: updateUser, error: updateError } = await (new ServerRequestHandle(userSchema, jwtSchema))
          .fetch(this.userRepository.getUserByJWT());
      if (updateError) throw updateError;
      return updateUser.get;
    }

    return data.get;
  }

  async signIn(input: AuthUser): Promise<User> {
    const handler = new ServerRequestHandle(
      jwtSchema,
      authSchema,
      new AuthUserValidationError(),
    );
    const { data, error } = await handler.fetch(
      this.userRepository.signIn(input),
    );
    if (error) throw error;

    const { access_token: accessToken, expires_in: expiresIn } = data.get;
    this.authStorage.setTokens(accessToken, expiresIn);

    return this.getAuthUser();
  }

  async signOut(): Promise<boolean> {
    const accessToken = await this.authStorage.getAccessToken();
    if (!accessToken)
      throw new UnauthenticatedError("Пользователь не авторизован");

    const handler = new ServerRequestHandle(z.boolean(), z.string());
    const { data, error } = await handler.fetch(this.userRepository.signOut());
    if (error) throw error;

    if (!data.get) throw new MetaError("Не получилось выйти из системы");

    this.authStorage.removeTokens();
    return data.get;
  }

  async canPermission(slug: PermissionType): Promise<boolean> {
    try {
      const user = await this.getAuthUser();
      return !!user.permissions?.find((permission) => permission.slug == slug);
    } catch {
      return false;
    }
  }
}
