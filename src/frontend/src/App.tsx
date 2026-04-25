import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { PracticePage } from "./pages/PracticePage";
import { ResultsPage } from "./pages/ResultsPage";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const practiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/practice",
  validateSearch: (search: Record<string, unknown>) => ({
    levelId: search.levelId ? Number(search.levelId) : 1,
    passageId:
      typeof search.passageId === "string" ? search.passageId : undefined,
  }),
  component: PracticePage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: ResultsPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  practiceRoute,
  resultsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
