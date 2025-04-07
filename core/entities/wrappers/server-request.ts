import { z } from "zod";
import { MetaError } from "@core/entities/errors/meta";
import {
  ValidationError,
  type ValidationErrorFields,
} from "@core/entities/wrappers/validation";
import { AxiosError } from "axios";

export interface ServerRequest<T, R> {
  id: string;
  successful: boolean;
  data: T | null;
  meta: {
    type: "error_validation" | "error_server";
    data: string | R;
  } | null;
}

class DataNullError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "DataNullError";
  }
}

class ServerRequestData<T> {
  constructor(private data: T | null) {}

  get get(): NonNullable<T> {
    if (this.data == null) {
      throw new DataNullError(
        "Данные не могут быть null. Проверьте поле error на null",
      );
    }
    return this.data;
  }
}

function createSuccessResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    id: z.string(),
    successful: z.literal(true),
    data: dataSchema,
    meta: z.null().optional(),
  });
}

export function createValidationErrorSchema<R extends z.ZodTypeAny>(
  dataSchema: R,
) {
  return z.object({
    id: z.string(),
    successful: z.literal(false),
    data: z.null().optional(),
    meta: z.object({
      type: z.literal("error_validation"),
      data: dataSchema,
    }),
  });
}

const serverErrorSchema = z.object({
  id: z.string(),
  successful: z.literal(false),
  data: z.null().optional(),
  meta: z.object({
    type: z.literal("error_server"),
    data: z.string(),
  }),
});

function createApiResponseSchema<
  T extends z.ZodTypeAny,
  R extends z.ZodTypeAny,
>(dataSchema: T, validationErrors: R) {
  return z.union([
    createSuccessResponseSchema(dataSchema),
    createValidationErrorSchema(validationErrors),
    serverErrorSchema,
  ]);
}

export const convertToArrayValidation = <T extends z.ZodTypeAny>(
  schema: T,
): z.ZodTypeAny => {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape as Record<string, z.ZodTypeAny>;

    return z.object(
      Object.fromEntries(
        Object.entries(shape).map(([key, value]) => {
          return [
            key,
            z
              .union([
                z.array(z.string()).optional(),
                convertToArrayValidation(value),
              ])
              .optional(),
          ];
        }),
      ),
    );
  } else if (schema instanceof z.ZodArray) {
    return z.array(z.string()).optional();
  } else {
    return z.array(z.string()).optional();
  }
};

export class ServerRequestHandle<
  T extends z.ZodTypeAny,
  R extends z.ZodTypeAny,
  V extends ValidationError<ValidationErrorFields<R>>,
> {
  idRequest: string | null = null;
  dataRequest: T | null | undefined = null;
  error: MetaError | V | null = null;

  private messageKnowError = "Непредвиденная ошибка. Номер запроса $id";

  constructor(
    readonly dataSchema: T,
    readonly validationErrors: R,
    readonly instanceValidationErrors?: V,
  ) {}

  async fetch(promise: Promise<unknown>) {
    let data: unknown;

    try {
      data = await promise;
    } catch (e) {
      if (e instanceof AxiosError) {
        data = e.response?.data;
      } else {
        this.error = new MetaError(this.buildMessageKnowError());
        return this;
      }
    }

    const schemaResponse = createApiResponseSchema(
      this.dataSchema,
      convertToArrayValidation(this.validationErrors),
    );

    const validator = schemaResponse.safeParse(data);
    if (!validator.success) {
      // todo: удалить
      console.log(data, validator.error);
      this.error = new MetaError("Ошибка валидации данных c сервера");
      return this;
    }
    const safeData = validator.data;
    this.idRequest = safeData.id;

    if (safeData.successful) {
      this.dataRequest = safeData.data;
      return this;
    }

    if (safeData.meta?.type === "error_validation") {
      const validationError = new ValidationError(
        "Ошибка валидации данных",
        safeData.meta.data as ValidationErrorFields<R>,
      ) as V;

      if (this.instanceValidationErrors) {
        const prototype: unknown = Object.getPrototypeOf(
          this.instanceValidationErrors,
        );
        if (typeof prototype == "object") {
          Object.setPrototypeOf(validationError, prototype);
        }
      }

      this.error = validationError;
      return this;
    }

    this.error = new MetaError(
      safeData.meta?.data ?? this.buildMessageKnowError(),
    );
    return this;
  }

  get data(): ServerRequestData<z.infer<T>> {
    return new ServerRequestData<z.infer<T>>(this.dataRequest);
  }

  private buildMessageKnowError(): string {
    return this.idRequest
      ? this.messageKnowError.replace("$id", this.idRequest)
      : "не определен";
  }
}
