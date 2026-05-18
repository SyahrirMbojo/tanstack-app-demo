import { countTodos } from "#/routes/_authenticated/todos/_server/-todos";
import { countUsers } from "#/routes/_authenticated/users/_server/-users";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/home/")({
  component: HomePage,
  beforeLoad: ({ context }) => {
    return { user: context };
  },
  loader: async () => {
    const userCount = await countUsers();
    const todosCount = await countTodos();
    return { userCount, todosCount };
  },
});

function HomePage() {
  const { user } = Route.useRouteContext();
  const counts = Route.useLoaderData();

  return (
    <main className="w-full px-8 pb-8 pt-10">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">TanStack Start Base Template</p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          Selamat datang, {user?.name || "User"}!
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          Anda telah berhasil login ke aplikasi TanStack Start dengan Prisma.
          Nikmati pengalaman yang seamless dengan teknologi terkini.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/about"
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
          >
            About This Starter
          </Link>
          <a
            href="https://tanstack.com/router"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
          >
            Router Guide
          </a>
        </div>

        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
              <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base/7 text-[var(--sea-ink-soft)] sm:text-lg">
                  Total User
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
                  {counts.userCount}
                </dd>
              </div>
              <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base/7 text-[var(--sea-ink-soft)] sm:text-lg">
                  Total Todo
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
                  {counts.todosCount}
                </dd>
              </div>
              <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base/7 text-[var(--sea-ink-soft)] sm:text-lg">
                  New users annually
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
                  100
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            "Type-Safe Routing",
            "Routes and links stay in sync across every page.",
          ],
          [
            "Server Functions",
            "Call server code from your UI without creating API boilerplate.",
          ],
          [
            "Streaming by Default",
            "Ship progressively rendered responses for faster experiences.",
          ],
          [
            "Tailwind Native",
            "Design quickly with utility-first styling and reusable tokens.",
          ],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
              {title}
            </h2>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{desc}</p>
          </article>
        ))}
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">User Information</p>
        <div className="space-y-2 text-sm text-[var(--sea-ink-soft)]">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          {user?.email && (
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          )}
        </div>
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">Quick Start</p>
        <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
          <li>
            Edit <code>src/routes/index.tsx</code> to customize the home page.
          </li>
          <li>
            Update <code>src/components/Header.tsx</code> and{" "}
            <code>src/components/Footer.tsx</code> for brand links.
          </li>
          <li>
            Add routes in <code>src/routes</code> and tweak visual tokens in{" "}
            <code>src/styles.css</code>.
          </li>
        </ul>
      </section>
    </main>
  );
}
