import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { getAuthSessionUser } from "./server/session.server";

const requestMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getAuthSessionUser();
  if (!user) {
    throw redirect({ to: "/login" });
  }

  return await next({
    context: {
      user: user,
    },
  });
});

export const checkMiddleware = createServerFn()
  .middleware([requestMiddleware])
  .handler(async ({ context }) => {
    // get context user from middleware
    return context.user;
  });

const checkMiddlewareAuth = createMiddleware().server(async ({ next }) => {
  const user = await getAuthSessionUser();
  if (user) {
    throw redirect({ to: "/" });
  }

  return await next();
});

export const checkAuthLogin = createServerFn()
  .middleware([checkMiddlewareAuth])
  .handler(async () => {
    return null;
  });
