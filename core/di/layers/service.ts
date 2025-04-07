import {container} from "tsyringe";
import {AUTH_SERVICE, type IAuthenticationService} from "@core/application/services/authentication.service";
import {AuthenticationService} from "@core/infrastructure/services/authentication.service";
import {AUTH_REPOSITORY} from "@core/application/repositories/auth.repository";
import {AUTH_STORAGE} from "@core/frameworks/auth-storage/interface";

export default function ConnectionServiceDI() {
    container.register<IAuthenticationService>(AUTH_SERVICE, {
        useFactory: (c) => new AuthenticationService(c.resolve(AUTH_REPOSITORY), c.resolve(AUTH_STORAGE))
    });
}