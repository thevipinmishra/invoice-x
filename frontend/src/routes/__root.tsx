import { createRootRoute, Outlet } from "@tanstack/react-router";
import {
  type NavigateOptions,
  type ToOptions,
  useRouter,
} from "@tanstack/react-router";
import { RouterProvider } from "react-aria-components";

declare module "react-aria-components" {
  interface RouterConfig {
    href: ToOptions["to"];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <RouterProvider
      navigate={(to, options) => router.navigate({ to, ...options })}
    >
      {children}
    </RouterProvider>
  );
}

export const Route = createRootRoute({
  component: () => (
    <Providers>
      <Outlet />
    </Providers>
  ),
});
