import { container } from "tsyringe";
import {
  AUTH_STORAGE,
  type IAuthStorage,
} from "@core/frameworks/auth-storage/interface";
import { AuthStorage } from "@core/frameworks/auth-storage/web";
import { type ILogger, LOGGER } from "@core/frameworks/logger/interface";
import { ConsoleLogger } from "@core/frameworks/logger/console";

export default function ConnectionFrameworkDI() {
  container.register<IAuthStorage>(AUTH_STORAGE, { useClass: AuthStorage });
  container.register<ILogger>(LOGGER, { useClass: ConsoleLogger });
}
