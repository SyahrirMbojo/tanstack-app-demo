import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full px-10 mx-auto">
      <div className="border-b border-gray-200">
        <nav className="flex gap-6 border-b border-gray-200">
          <Link
            to="/settings/notification"
            activeProps={{
              className: "nav-link is-active",
            }}
            className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Notification
          </Link>

          <Link
            to="/settings/profile"
            activeProps={{
              className: "nav-link is-active",
            }}
            className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Profile
          </Link>
        </nav>
      </div>

      {/* Tab Content */}
      <main className="w-full pt-8">
        <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
