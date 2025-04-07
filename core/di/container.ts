import "reflect-metadata";
import { container } from "tsyringe";
import ConnectionRepositoryDI from "@core/di/layers/repository";
import ConnectionFrameworkDI from "@core/di/layers/framework";
import ConnectionServiceDI from "@core/di/layers/service";
import ConnectionControllerDI from "@core/di/layers/controller";

ConnectionRepositoryDI();
ConnectionFrameworkDI();
ConnectionServiceDI();
ConnectionControllerDI();

export const appResolve = async <T>(name: string): Promise<T> => {
  return container.resolve<T>(name);
};
