"use client";

import { CookiesProvider } from "next-client-cookies";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
