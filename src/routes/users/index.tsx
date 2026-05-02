import MainPage from "#/components/MainPage";
import { deleteUserRecord, listUsers } from "#/controllers/users";
import { checkMiddleware } from "#/middleware";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

type UserSearch = {
  page: number;
  pageSize: number;
  q: string;
};

export const Route = createFileRoute("/users/")({
  validateSearch: (search: Record<string, unknown>): UserSearch => ({
    page: Number(search.page ?? 1),
    pageSize: Number(search.pageSize ?? 10),
    q: typeof search.q === "string" ? search.q : "",
  }),
  beforeLoad: async () => {
    const currentUser = await checkMiddleware();
    return { currentUser };
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => await listUsers({ data: deps }),
  component: UsersPage,
});

function UsersPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { currentUser } = Route.useRouteContext();
  const { users, pagination } = Route.useLoaderData();
  const [query, setQuery] = useState(search.q);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rowStart = useMemo(() => {
    if (pagination.total === 0) {
      return 0;
    }

    return (pagination.current_page - 1) * pagination.per_page + 1;
  }, [pagination.current_page, pagination.per_page, pagination.total]);

  const rowEnd = Math.min(
    pagination.current_page * pagination.per_page,
    pagination.total,
  );

  const updateSearch = (next: Partial<UserSearch>) => {
    navigate({
      to: "/users",
      search: {
        page: next.page ?? search.page,
        pageSize: next.pageSize ?? search.pageSize,
        q: next.q ?? search.q,
      },
    });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearch({ page: 1, q: query.trim() });
  };

  const handleDelete = async (user: (typeof users)[number]) => {
    if (user.id === currentUser.id) {
      setError("User yang sedang login tidak bisa dihapus dari tabel ini");
      return;
    }

    const confirmed = window.confirm(`Hapus user ${user.name}?`);
    if (!confirmed) {
      return;
    }

    setError(null);
    setDeletingId(user.id);

    try {
      await deleteUserRecord({ data: { id: user.id } });
      await router.invalidate();
    } catch (err: any) {
      setError(err.message || "Gagal menghapus user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <MainPage title="Users" desc="Management user account">
      <div className="relative z-10 space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <form
            onSubmit={handleSearch}
            className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] py-2.5 pl-10 pr-3 text-sm text-[var(--sea-ink)] outline-none transition focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[rgba(79,184,178,0.2)]"
                placeholder="Search name, username, email, phone"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-4 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Search
            </button>
          </form>

          <Link
            to="/users/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[rgba(50,143,151,0.3)] bg-[var(--lagoon-deep)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(50,143,151,0.18)] transition hover:-translate-y-0.5 hover:bg-[var(--palm)]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add User
          </Link>
        </div>

        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left text-sm">
              <thead className="bg-[rgba(79,184,178,0.12)] text-xs uppercase text-[var(--sea-ink-soft)]">
                <tr>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Username</th>
                  <th className="px-4 py-3 font-bold">Email</th>
                  <th className="px-4 py-3 font-bold">Gender</th>
                  <th className="px-4 py-3 font-bold">Phone</th>
                  <th className="px-4 py-3 font-bold">Created</th>
                  <th className="px-4 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-transparent transition hover:bg-[rgba(79,184,178,0.08)]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[var(--sea-ink)]">
                        {user.name}
                      </div>
                      <div className="max-w-[220px] truncate text-xs text-[var(--sea-ink-soft)]">
                        {user.address || "No address"}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--sea-ink)]">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-[var(--sea-ink-soft)]">
                      {user.email || "-"}
                    </td>
                    <td className="px-4 py-3 capitalize text-[var(--sea-ink-soft)]">
                      {user.gender}
                    </td>
                    <td className="px-4 py-3 text-[var(--sea-ink-soft)]">
                      {user.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-[var(--sea-ink-soft)]">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to="/users/$userId/edit"
                          params={{ userId: String(user.id) }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink-soft)] transition hover:-translate-y-0.5 hover:text-[var(--lagoon-deep)]"
                          title="Edit user"
                          aria-label={`Edit ${user.name}`}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={
                            deletingId === user.id || user.id === currentUser.id
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/25 bg-red-500/10 text-red-600 transition hover:-translate-y-0.5 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-45 dark:text-red-300"
                          title={
                            user.id === currentUser.id
                              ? "Cannot delete current user"
                              : "Delete user"
                          }
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-[var(--sea-ink-soft)]"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[var(--line)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[var(--sea-ink-soft)]">
              Showing {rowStart}-{rowEnd} of {pagination.total}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={pagination.per_page}
                onChange={(event) =>
                  updateSearch({
                    page: 1,
                    pageSize: Number(event.target.value),
                  })
                }
                className="h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-2 text-sm text-[var(--sea-ink)] outline-none"
                aria-label="Rows per page"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  updateSearch({ page: pagination.current_page - 1 })
                }
                disabled={pagination.current_page <= 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="min-w-24 text-center text-sm font-semibold text-[var(--sea-ink)]">
                {pagination.current_page} / {pagination.total_page}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateSearch({ page: pagination.current_page + 1 })
                }
                disabled={pagination.current_page >= pagination.total_page}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainPage>
  );
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
