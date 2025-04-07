import {
  AUTH_SERVICE,
  type IAuthenticationService,
  type PermissionType,
} from "@core/application/services/authentication.service";
import { appResolve } from "@core/di/container";
import type { User } from "@core/entities/models/user";
import {
  type ISignInController,
  SIGN_IN_CONTROLLER,
} from "@core/controllers/sign-in.controller";

export const canPermissionUseCase = async (
  slug: PermissionType,
): Promise<boolean> => {
  const authService = await appResolve<IAuthenticationService>(AUTH_SERVICE);
  return authService.canPermission(slug);
};

export const checkAuthUseCase = async (): Promise<User> => {
  const authService = await appResolve<IAuthenticationService>(AUTH_SERVICE);
  return authService.getAuthUser();
};

export const signInUseCase = async (): Promise<ISignInController> => {
  return appResolve<ISignInController>(SIGN_IN_CONTROLLER);
};

export const signOutUseCase = async (): Promise<boolean> => {
  const authService = await appResolve<IAuthenticationService>(AUTH_SERVICE);
  return authService.signOut();
};
