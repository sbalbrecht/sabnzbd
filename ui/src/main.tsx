import ReactDOM from "react-dom/client";
import { StrictMode, useEffect } from "react";
import { RouterProvider, Router } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.js";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { i18n, I18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
// @ts-expect-error LinguiJS Vite plugin compiles po file to a module during build
import { messages } from "../../po/main/en.po";
import { dynamicActivate } from "./i18n.js";
import { fetchHeader } from "./api/common.js";
import "./assets/css/bootstrap.min.css";
import "./assets/js/jquery-3.5.1.min.js";
import "./assets/js/bootstrap.min.js";
import "./index.css";

const queryClient = new QueryClient();

// Create a new router instance
const router = new Router({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Load and activate translation for default language
i18n.load({ en: messages });
i18n.activate("en");

type AppProps = {
  i18n: I18n;
  router: Router;
};

export function App({ i18n, router }: AppProps) {
  // Load and activate translation for user's selected language
  const { data } = useQuery({ queryKey: ["lang"], queryFn: fetchHeader });
  useEffect(() => {
    if (data && data["active_lang"]) {
      dynamicActivate(data["active_lang"]);
    }
  }, [data]);

  return (
    <I18nProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}

// Render app
const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App i18n={i18n} router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
