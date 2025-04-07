import { type ILogger } from "@core/frameworks/logger/interface";

export class ConsoleLogger implements ILogger {
  info(message?: unknown, ...optionalParams: unknown[]): void {
    console.log(message, ...optionalParams);
  }

  error(message?: unknown, ...optionalParams: unknown[]): void {
    console.error(message, ...optionalParams);
  }

  warn(message?: unknown, ...optionalParams: unknown[]): void {
    console.warn(message, ...optionalParams);
  }
}
