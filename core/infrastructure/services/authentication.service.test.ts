import { beforeEach, expect, it, vi } from "vitest";
import { AuthenticationService } from "./authentication.service";
import { UnauthenticatedError } from "@core/entities/errors/auth";
import { MetaError } from "@core/entities/errors/meta";
import { AuthUserValidationError } from "@core/entities/errors/valid";
import {
  type AuthUser,
  type AuthUserValidationField,
  type JWT,
  type User,
} from "@core/entities/models/user";
import { type IAuthRepository } from "@core/application/repositories/auth.repository";
import { type IAuthStorage } from "@core/frameworks/auth-storage/interface";
import { type ServerRequest } from "@core/entities/wrappers/server-request";
import { PERMISSIONS } from "@core/application/services/authentication.service";

const mockUser: User = {
  id: 1,
  user_leader: null,
  permissions: [
    {
      slug: PERMISSIONS.AUTH_PERMISSION,
      type: "",
      label: "",
      created_at: new Date(),
    },
  ],
  email: "test@example.com",
  first_name: "Иван",
  second_name: "Иванов",
  middle_name: null,
  dismiss_at: null,
  created_at: new Date(),
  updated_at: null,
  deleted_at: null,
};

const mockJWT: JWT = {
  access_token: "jwt.token.123",
  token_type: "Bearer",
  expires_in: 3600,
};

const mockSignInInput: AuthUser = {
  email: "test@example.com",
  password: "secret123",
};

let authStorage: IAuthStorage;
let userRepository: IAuthRepository;
let service: AuthenticationService;

const userResponse: ServerRequest<User, string> = {
  id: "abc",
  successful: true,
  data: mockUser,
  meta: null,
};

const tokenErrorResponse: ServerRequest<User, string> = {
  id: "err1",
  successful: false,
  data: null,
  meta: {
    type: "error_server",
    data: "Token expired",
  },
};

const jwtResponse: ServerRequest<JWT, null> = {
  id: "jwt1",
  successful: true,
  data: mockJWT,
  meta: null,
};

beforeEach(() => {
  authStorage = {
    setTokens: vi.fn(),
    getAccessToken: vi.fn(),
    removeTokens: vi.fn(),
  };

  userRepository = {
    getUserByJWT: vi.fn(),
    updateJWT: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  };

  service = new AuthenticationService(userRepository, authStorage);
});

it("getAuthUser: возвращает пользователя при валидном токене", async () => {
  authStorage.getAccessToken = vi.fn().mockResolvedValue("jwt.token.123");
  userRepository.getUserByJWT = vi.fn().mockResolvedValue(userResponse);

  const result = await service.getAuthUser();
  expect(result).toEqual(mockUser);
});
it("getAuthUser: обновляет токен и повторяет запрос, если первый завершился ошибкой", async () => {
  authStorage.getAccessToken = vi.fn().mockResolvedValue("jwt.token.123");

  userRepository.getUserByJWT = vi
    .fn()
    .mockResolvedValueOnce(tokenErrorResponse)
    .mockResolvedValueOnce(userResponse);

  userRepository.updateJWT = vi.fn().mockResolvedValue(jwtResponse);

  const result = await service.getAuthUser();

  expect(result).toEqual(mockUser);
});
it("getAuthUser: выбрасывает ошибку, если токен отсутствует", async () => {
  authStorage.getAccessToken = vi.fn().mockResolvedValue(null);
  await expect(service.getAuthUser()).rejects.toThrow(UnauthenticatedError);
});
it("getAuthUser: выбрасывает ошибку при неудачной попытке обновить токен", async () => {
  authStorage.getAccessToken = vi.fn().mockResolvedValue("jwt.token.123");

  userRepository.getUserByJWT = vi
    .fn()
    .mockResolvedValueOnce(tokenErrorResponse);

  userRepository.updateJWT = vi.fn().mockResolvedValue({
    ...jwtResponse,
    successful: false,
    meta: {
      type: "error_server",
      data: "Invalid refresh",
    },
  });

  await expect(service.getAuthUser()).rejects.toThrow(MetaError);
});
it("getAuthUser: выбрасывает ошибку, если после обновления токена пользователь не получен", async () => {
  authStorage.getAccessToken = vi.fn().mockResolvedValue("jwt.token.123");

  userRepository.getUserByJWT = vi
    .fn()
    .mockResolvedValueOnce(tokenErrorResponse)
    .mockResolvedValueOnce(tokenErrorResponse); // повторная ошибка

  userRepository.updateJWT = vi.fn().mockResolvedValue(jwtResponse);

  await expect(service.getAuthUser()).rejects.toThrow(MetaError);
});

it("signIn: авторизует пользователя и возвращает его", async () => {
  userRepository.signIn = vi.fn().mockResolvedValue(jwtResponse);
  authStorage.setTokens = vi.fn();
  userRepository.getUserByJWT = vi.fn().mockResolvedValue(userResponse);
  authStorage.getAccessToken = vi.fn().mockResolvedValue("jwt.token.123");

  const result = await service.signIn(mockSignInInput);

  expect(result).toEqual(mockUser);
});
it("signIn: выбрасывает ошибку валидации при некорректном вводе", async () => {
  const invalidResponse: ServerRequest<JWT, AuthUserValidationField> = {
    id: "invalid",
    successful: false,
    data: null,
    meta: {
      type: "error_validation",
      data: { email: ["Некорректный email"] },
    },
  };

  userRepository.signIn = vi.fn().mockResolvedValue(invalidResponse);

  await expect(service.signIn(mockSignInInput)).rejects.toThrow(
    AuthUserValidationError,
  );
});

it("signOut: корректно выходит из системы", async () => {
  authStorage.getAccessToken = vi.fn().mockResolvedValue("jwt.token.123");
  userRepository.signOut = vi.fn().mockResolvedValue({
    id: "logout",
    successful: true,
    data: true,
    meta: null,
  });
  authStorage.removeTokens = vi.fn();

  const result = await service.signOut();

  expect(result).toBe(true);
});

it("signOut: выбрасывает ошибку, если пользователь не авторизован", async () => {
  authStorage.getAccessToken = vi.fn().mockResolvedValue(null);
  await expect(service.signOut()).rejects.toThrow(UnauthenticatedError);
});

it("signOut: выбрасывает ошибку при неудачном выходе", async () => {
  authStorage.getAccessToken = vi.fn().mockResolvedValue("jwt.token.123");

  userRepository.signOut = vi.fn().mockResolvedValue({
    id: "logout",
    successful: true,
    data: false,
    meta: null,
  });

  await expect(service.signOut()).rejects.toThrow(MetaError);
});

it("canPermission: возвращает true при наличии разрешения", async () => {
  authStorage.getAccessToken = vi.fn().mockResolvedValue("jwt.token.123");
  userRepository.getUserByJWT = vi.fn().mockResolvedValue(userResponse);

  const result = await service.canPermission("auth-permission");
  expect(result).toBe(true);
});

it("canPermission: возвращает false при отсутствии разрешения", async () => {
  const userWithoutPermission = {
    ...mockUser,
    permissions: [],
  };

  const noPermissionResponse: ServerRequest<User, string> = {
    id: "no-perm",
    successful: true,
    data: userWithoutPermission,
    meta: null,
  };

  authStorage.getAccessToken = vi.fn().mockResolvedValue("jwt.token.123");
  userRepository.getUserByJWT = vi.fn().mockResolvedValue(noPermissionResponse);

  const result = await service.canPermission(PERMISSIONS.NOT_PERMISSION);
  expect(result).toBe(false);
});

it("canPermission: возвращает false при ошибке получения пользователя", async () => {
  authStorage.getAccessToken = vi.fn().mockResolvedValue(null);
  const result = await service.canPermission(PERMISSIONS.AUTH_PERMISSION);
  expect(result).toBe(false);
});
