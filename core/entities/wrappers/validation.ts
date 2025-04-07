import { type z } from "zod";

export type ValidationErrorFields<T extends z.ZodTypeAny> =
  T extends z.ZodObject<infer Shape>
    ? { [K in keyof Shape]?: string[] | ValidationErrorFields<Shape[K]> }
    : T extends z.ZodArray<infer U>
      ? ValidationErrorFields<U>[] | string[] | undefined
      : string[] | undefined;

export class ValidationError<T> extends Error {
  private readonly validationErrors?: T;

  constructor(message?: string, validationErrors?: T, options?: ErrorOptions) {
    super(message ?? "Ошибка валидации параметров", options);
    this.name = "ValidationError";
    this.validationErrors = validationErrors;
  }

  get errors(): T {
    if (!this.validationErrors) {
      return {} as T;
    }

    return this.validationErrors;
  }
}
