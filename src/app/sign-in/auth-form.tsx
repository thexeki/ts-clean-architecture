"use client";

import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { AuthUserValidationError } from "@core/entities/errors/valid";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { MetaError } from "@core/entities/errors/meta";
import { UnauthenticatedError } from "@core/entities/errors/auth";
import { useRouter } from "next/navigation";
import { signInUseCase } from "@core/use-cases/auth.use-case";
import { logger } from "@web/utils/logger";
import { Form } from "@heroui/form";
import type {
  AuthUser,
  AuthUserValidationField,
} from "@core/entities/models/user";

export default function AuthForm() {
  const [values, setValues] = useState<AuthUser>({ email: "", password: "" });
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [errors, setErrors] = useState<AuthUserValidationField>();
  const [globalError, setGlobalError] = useState<string>();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      setErrors({});
      setGlobalError("");
      try {
        const controller = await signInUseCase();
        const res = await controller(values);
        setIsComplete(!!res);
        if (!!res) router.push("/");
      } catch (e) {
        if (e instanceof AuthUserValidationError) {
          setErrors(e.errors);
        } else if (
          e instanceof MetaError ||
          e instanceof UnauthenticatedError
        ) {
          setGlobalError(e.message);
        } else {
          setGlobalError("Произошла неизвестная ошибка");
        }
        logger.error(e);
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  return (
    <Form validationErrors={errors} onSubmit={handleSubmit}>
      <div className={"w-full"}>
        <div className="mt-2">
          <Input
            id="email"
            name="email"
            type="email"
            label="Электронная почта"
            variant="bordered"
            isRequired
            value={values.email}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            autoComplete="email"
          />
        </div>
      </div>

      <div className={"w-full"}>
        <div className="mt-2">
          <Input
            label="Пароль"
            id="password"
            name="password"
            type="password"
            isRequired
            variant="bordered"
            value={values.password}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            autoComplete="current-password"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm/6">
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Не помните пароль?
          </a>
        </div>
      </div>

      {globalError != "" && (
        <p className="text-sm text-red-500">{globalError}</p>
      )}

      <Button
        color={isComplete ? "success" : "primary"}
        fullWidth={true}
        type="submit"
        isLoading={isPending}
        isDisabled={isComplete}
        className={"text-white"}
      >
        {isComplete ? "Аворизация прошла успешно" : "Войти"}
      </Button>
    </Form>
  );
}
