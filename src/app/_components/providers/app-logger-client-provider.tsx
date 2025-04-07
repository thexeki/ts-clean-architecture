"use client";

import React, { createContext, useContext } from "react";
import { type ILogger } from "@core/frameworks/logger/interface";
import { getLogUseCase } from "@core/use-cases/logging.use-case";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/spinner";

const LoggerContext = createContext<ILogger | null>(null);

export function useLogger() {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error("useLogger must be used within a LoggerProvider");
  }
  return context;
}

export function AppLoggerClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["logger"],
    queryFn: async () => {
      return await getLogUseCase();
    },
    staleTime: 1000 * 60,
  });

  if (isLoading || !data)
    return (
      <div className={"mt-10 flex h-full w-full items-center justify-center"}>
        <Spinner />
      </div>
    );

  return (
    <LoggerContext.Provider value={data}>{children}</LoggerContext.Provider>
  );
}
