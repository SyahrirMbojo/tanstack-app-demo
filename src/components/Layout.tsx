import Header from "./Header";
import { Outlet, useLocation } from "@tanstack/react-router";
import Footer from "./Footer";
import type { AuthUser } from "#/server/auth";

type LayoutProps = {
  user: AuthUser | null;
};

export default function Layout({ user }: LayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const isAuth = pathname === "/login" || pathname === "/register";
  return (
    <div>
      {isAuth ? (
        <Outlet />
      ) : (
        <>
          <Header user={user} />
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  );
}
