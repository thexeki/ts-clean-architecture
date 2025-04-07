import { container } from "tsyringe";
import { AUTH_SERVICE } from "@core/application/services/authentication.service";
import {
  type ISignInController,
  SIGN_IN_CONTROLLER,
  signInController,
} from "@core/controllers/sign-in.controller";

export default function ConnectionControllerDI() {
  container.register<ISignInController>(SIGN_IN_CONTROLLER, {
    useFactory: (c) => signInController(c.resolve(AUTH_SERVICE)),
  });
}
