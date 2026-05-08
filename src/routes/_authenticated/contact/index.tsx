import MainPage from "#/components/MainPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/contact/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MainPage title="Contact" desc="This page to contact">
      <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
        TanStack Start gives you type-safe routing, server functions, and modern
        SSR defaults. Use this as a clean foundation, then layer in your own
        routes, styling, and add-ons.
      </p>
    </MainPage>
  );
}
