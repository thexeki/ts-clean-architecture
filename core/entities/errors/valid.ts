import { ValidationError } from "@core/entities/wrappers/validation";
import {
  type AuthUserValidationField,
} from "@core/entities/models/user";

export class AuthUserValidationError extends ValidationError<AuthUserValidationField> {}
