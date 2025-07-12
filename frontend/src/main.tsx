import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource-variable/dm-sans/index.css";
import "./index.css";

import { routeTree } from "./routeTree.gen";
import { Loading } from "./components/utils/loading";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: 1000 * 60 * 25,
        }
    }
});

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <RouterProvider defaultPendingComponent={Loading} router={router} />
          <Toaster />
      </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
