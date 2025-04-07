import { appResolve } from "@core/di/container";
import { type ILogger, LOGGER } from "@core/frameworks/logger/interface";

export const getLogUseCase = async () => {
  return await appResolve<ILogger>(LOGGER);
};
