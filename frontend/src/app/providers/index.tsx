import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";

export const Providers = ({ children }: { children: ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};
