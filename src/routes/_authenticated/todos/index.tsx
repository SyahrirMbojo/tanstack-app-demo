import MainPage from "#/components/MainPage";
import TableCell from "#/components/TableCell";
import TableEmpty from "#/components/TableEmpty";
import TableRow from "#/components/TableRow";
import TableView, { type TableColumnModel } from "#/components/TableView";
import { formatDate } from "#/helper/utils";
import {
  createTodoRecord,
  deleteTodoRecord,
  listTodos,
  updateTodoRecord,
  type TodoFormInput,
} from "#/routes/_authenticated/todos/_server/-todos";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useState } from "react";

type TodoSearch = {
  page: number;
  pageSize: number;
  q: string;
};

const columns: TableColumnModel[] = [
  {
    title: "No",
  },
  {
    title: "Title",
  },
  {
    title: "Created",
  },
  {
    title: "Action",
    align: "text-right",
  },
];

const EMPTY_FORM: TodoFormInput = {
  title: "",
};

export const Route = createFileRoute("/_authenticated/todos/")({
  validateSearch: (search: Record<string, unknown>): TodoSearch => ({
    page: Number(search.page ?? 1),
    pageSize: Number(search.pageSize ?? 10),
    q: typeof search.q === "string" ? search.q : "",
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => await listTodos({ data: deps }),
  component: TodosPage,
});

function TodosPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { todos, pagination } = Route.useLoaderData();
  const [query, setQuery] = useState(search.q);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<TodoFormInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  let indexPage = 1;
  indexPage = pagination.current_page - 1;
  const noPage = indexPage * pagination.per_page + 1;

  const updateSearch = (next: Partial<TodoSearch>) => {
    navigate({
      to: "/todos",
      search: {
        page: next.page ?? search.page,
        pageSize: next.pageSize ?? search.pageSize,
        q: next.q ?? search.q,
      },
    });
  };

  const openCreateForm = () => {
    setError(null);
    setForm(EMPTY_FORM);
    setFormMode("create");
  };

  const openEditForm = (todo: (typeof todos)[number]) => {
    setError(null);
    setForm({
      id: todo.id,
      title: todo.title,
    });
    setFormMode("edit");
  };

  const closeForm = () => {
    setFormMode(null);
    setForm(EMPTY_FORM);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearch({ page: 1, q: query.trim() });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSaving(true);

    try {
      if (formMode === "edit") {
        await updateTodoRecord({ data: form });
      } else {
        await createTodoRecord({ data: form });
      }

      await router.invalidate();
      closeForm();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan todo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (todo: (typeof todos)[number]) => {
    const confirmed = window.confirm(`Hapus todo "${todo.title}"?`);
    if (!confirmed) {
      return;
    }

    setError(null);
    setDeletingId(todo.id);

    try {
      await deleteTodoRecord({ data: { id: todo.id } });

      if (todos.length === 1 && pagination.current_page > 1) {
        updateSearch({ page: pagination.current_page - 1 });
      } else {
        await router.invalidate();
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghapus todo");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <MainPage title="Todos" desc="Management todo list">
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
                placeholder="Search todo title"
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

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[rgba(50,143,151,0.3)] bg-[var(--lagoon-deep)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(50,143,151,0.18)] transition hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4 text-white" aria-hidden="true" />
            <div className="text-white text-sm font-semibold">Add Todo</div>
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {formMode && (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <label className="flex-1">
                <span className="mb-1.5 block text-sm font-semibold text-[var(--sea-ink-soft)]">
                  Title
                </span>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  required
                  className="form-input"
                  placeholder="Input todo title"
                />
              </label>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[var(--sea-ink-soft)] transition hover:bg-[rgba(79,184,178,0.1)]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[rgba(50,143,151,0.3)] bg-[var(--lagoon-deep)] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--palm)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
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
          {todos.map((todo, index) => (
            <TableRow key={todo.id}>
              <TableCell>{noPage + index}</TableCell>
              <TableCell>
                <div className="font-semibold text-[var(--sea-ink)]">
                  {todo.title}
                </div>
              </TableCell>
              <TableCell>{formatDate(todo.createdAt)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditForm(todo)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink-soft)] transition hover:-translate-y-0.5 hover:text-[var(--lagoon-deep)]"
                    title="Edit todo"
                    aria-label={`Edit ${todo.title}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(todo)}
                    disabled={deletingId === todo.id}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/25 bg-red-500/10 text-red-600 transition hover:-translate-y-0.5 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-45 dark:text-red-300"
                    title="Delete todo"
                    aria-label={`Delete ${todo.title}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {todos.length === 0 && (
            <TableEmpty colSpan={columns.length} message="No todos found" />
          )}
        </TableView>
      </div>
    </MainPage>
  );
}
