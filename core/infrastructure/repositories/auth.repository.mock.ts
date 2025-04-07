import {
  type AuthUser,
  type AuthUserValidationField,
  type JWT,
  type User,
} from "@core/entities/models/user";
import { type ServerRequest } from "@core/entities/wrappers/server-request";
import { type IAuthRepository } from "@core/application/repositories/auth.repository";
import { PERMISSIONS } from "@core/application/services/authentication.service";

export class MockAuthRepository implements IAuthRepository {
  private mockUser: User = {
    id: 1,
    email: "test@example.com",
    first_name: "John",
    second_name: "Doe",
    middle_name: "Middle",
    permissions: [
      {
        slug: PERMISSIONS.AUTH_PERMISSION,
        type: "private",
        label: "Право пользователя (AUTH_PERMISSION)",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    dismiss_at: null,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  private mockJWT: JWT = {
    access_token: "mock_access_token",
    token_type: "bearer",
    expires_in: 3600,
  };

  async signIn(
    input: AuthUser,
  ): Promise<ServerRequest<JWT, AuthUserValidationField>> {
    // Проверка пользователя (мок)
    if (input.email === this.mockUser.email) {
      return {
        id: "12",
        successful: true,
        data: this.mockJWT,
        meta: null,
      };
    }

    return {
      id: "12",
      successful: false,
      data: null,
      meta: {
        type: "error_server",
        data: "Неверный логин или пароль",
      },
    };
  }

  async getUserByJWT(): Promise<ServerRequest<User, string>> {
    return {
      id: "12",
      successful: true,
      data: this.mockUser,
      meta: null,
    };
  }

  async signOut(): Promise<ServerRequest<boolean, string>> {
    return {
      id: "12",
      successful: true,
      data: true,
      meta: null,
    };
  }

  async updateJWT(): Promise<ServerRequest<JWT, null>> {
    return {
      id: "12",
      successful: true,
      data: this.mockJWT,
      meta: null,
    };
  }
}
