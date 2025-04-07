import { container } from "tsyringe";
import {
  AUTH_REPOSITORY,
  type IAuthRepository,
} from "@core/application/repositories/auth.repository";
import { MockAuthRepository } from "@core/infrastructure/repositories/auth.repository.mock";
import { AuthRepository } from "@core/infrastructure/repositories/auth.repository";

const IS_MOCK_REPOSITORY = true;

export default function ConnectionRepositoryDI() {
  container.register<IAuthRepository>(AUTH_REPOSITORY, {
    useFactory: () => {
      return IS_MOCK_REPOSITORY
        ? new MockAuthRepository()
        : new AuthRepository();
    },
  });
}
