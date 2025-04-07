import { getLogUseCase } from "@core/use-cases/logging.use-case";
import { type ILogger } from "@core/frameworks/logger/interface";

const appLogger: Promise<ILogger> = getLogUseCase();

export const logger: ILogger = {
  info: (...args: unknown[]) => {
    void appLogger.then((a) => a.info(...args));
  },
  warn: (...args: unknown[]) => {
    void appLogger.then((a) => a.warn(...args));
  },
  error: (...args: unknown[]) => {
    void appLogger.then((a) => a.error(...args));
  },
};
