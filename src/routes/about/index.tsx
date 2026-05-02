import MainPage from "#/components/MainPage";
import { checkMiddleware } from "#/middleware";
import { createFileRoute } from "@tanstack/react-router";
import MyCard from "./_components/-MyCard";

export const Route = createFileRoute("/about/")({
  beforeLoad: async () => checkMiddleware(),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MainPage title="About" desc="A small starter with room to grow.">
      <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
        TanStack Start gives you type-safe routing, server functions, and modern
        SSR defaults. Use this as a clean foundation, then layer in your own
        routes, styling, and add-ons.
      </p>
      <MyCard />
    </MainPage>
  );
}
