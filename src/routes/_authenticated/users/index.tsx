import MainPage from "#/components/MainPage";
import TableCell from "#/components/TableCell";
import TableEmpty from "#/components/TableEmpty";
import TableRow from "#/components/TableRow";
import TableView, { type TableColumnModel } from "#/components/TableView";
import { formatDate } from "#/helper/utils";
import {
  deleteUserRecord,
  listUsers,
} from "#/routes/_authenticated/users/_server/-users";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

type UserSearch = {
  page: number;
  pageSize: number;
  q: string;
};

const columns: TableColumnModel[] = [
  {
    title: "No",
  },
  {
    title: "Name",
  },
  {
    title: "Email",
  },
  {
    title: "Gender",
  },
  {
    title: "Phone",
  },
  {
    title: "Username",
  },
  {
    title: "Created",
  },
  {
    title: "Action",
    align: "text-right",
  },
];

export const Route = createFileRoute("/_authenticated/users/")({
  validateSearch: (search: Record<string, unknown>): UserSearch => ({
    page: Number(search.page ?? 1),
    pageSize: Number(search.pageSize ?? 10),
    q: typeof search.q === "string" ? search.q : "",
  }),
  beforeLoad: async ({ context }) => {
    return { currentUser: context };
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

  let indexPage = 1;
  indexPage = pagination.current_page - 1;
  const noPage = indexPage * pagination.per_page + 1;

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
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[rgba(50,143,151,0.3)] bg-[var(--lagoon-deep)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(50,143,151,0.18)] transition hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4 text-white" aria-hidden="true" />
            <div className="text-white text-sm font-semibold">Add User</div>
          </Link>
        </div>

        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        <TableView
          columns={columns}
          pagination={pagination}
          onChangePage={(event) => {
            updateSearch({
              page: 1,
              pageSize: Number(event.target.value),
            });
          }}
          onBackPaging={() =>
            updateSearch({ page: pagination.current_page - 1 })
          }
          onNextPaging={() =>
            updateSearch({ page: pagination.current_page + 1 })
          }
        >
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{noPage + index}</TableCell>
              <TableCell>
                <div className="font-semibold text-[var(--sea-ink)]">
                  {user.name}
                </div>
                <div className="max-w-[220px] truncate text-xs text-[var(--sea-ink-soft)]">
                  {user.address || "No address"}
                </div>
              </TableCell>
              <TableCell>{user.email || "-"}</TableCell>
              <TableCell className="capitalize">{user.gender}</TableCell>
              <TableCell>{user.phone || "-"}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}

          {users.length === 0 && <TableEmpty colSpan={columns.length} />}
        </TableView>
      </div>
    </MainPage>
  );
}
