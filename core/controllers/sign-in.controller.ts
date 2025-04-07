import {
  authSchema,
  type AuthUser,
  type User,
} from "@core/entities/models/user";
import { type IAuthenticationService } from "@core/application/services/authentication.service";
import {
  AuthUserValidationError,
} from "@core/entities/errors/valid";

export const SIGN_IN_CONTROLLER = "ISignInController";

export type ISignInController = ReturnType<typeof signInController>;

export const signInController =
  (authenticationService: IAuthenticationService) =>
  async (input: AuthUser): Promise<User> => {
    const parseResult = authSchema.safeParse(input);

    if (!parseResult.success) {
      throw new AuthUserValidationError(
        "Ошибка валидации данных",
        parseResult.error.formErrors.fieldErrors,
      );
    }

    return await authenticationService.signIn(parseResult.data);
  };
