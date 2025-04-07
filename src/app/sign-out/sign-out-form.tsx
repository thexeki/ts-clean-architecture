"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOutUseCase } from "@core/use-cases/auth.use-case";
import { logger } from "@web/utils/logger";

export default function SignOutForm() {
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      try {
        const response = await signOutUseCase();
        logger.info("Sign-out response:", response);
      } catch (error) {
        logger.error("Sign-out error:", error);
      } finally {
        router.push("/");
      }
    };

    void signOut();
  }, [router]);

  return null;
}
