import { checkMiddleware } from "#/middleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => checkMiddleware(),
});
