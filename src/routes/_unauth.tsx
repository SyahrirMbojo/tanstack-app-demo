import { checkAuthLogin } from "#/middleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauth")({
  beforeLoad: () => checkAuthLogin(),
});
