import {
  clearSession,
  getSession,
  updateSession,
  type SessionConfig,
} from "@tanstack/react-start/server";
import { getUserById, type AuthUser } from "./auth.server";

type AuthSessionData = {
  userId: number;
};

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const DEV_SESSION_SECRET =
  "dev-only-tanstack-prisma-session-secret-change-in-production";

function getSessionPassword() {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production");
  }

  return DEV_SESSION_SECRET;
}

const authSessionConfig: SessionConfig = {
  name: "tanstack_prisma_auth",
  password: getSessionPassword(),
  maxAge: SESSION_MAX_AGE,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  },
};

export async function setAuthSession(user: AuthUser) {
  await updateSession<AuthSessionData>(authSessionConfig, {
    userId: user.id,
  });
}

export async function getAuthSessionUser(): Promise<AuthUser | null> {
  const session = await getSession<AuthSessionData>(authSessionConfig);
  const userId = session.data.userId;

  if (!userId) {
    return null;
  }

  return getUserById(userId);
}

export async function clearAuthSession() {
  await clearSession(authSessionConfig);
}
