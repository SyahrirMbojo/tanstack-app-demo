import MainPage from "#/components/MainPage";
import { createTodo, getTodos } from "#/controllers/todos";
import { checkMiddleware } from "#/middleware";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/todos/")({
  beforeLoad: async () => checkMiddleware(),
  component: TodosPage,
  loader: async () => await getTodos(),
});

function TodosPage() {
  const router = useRouter();
  const todos = Route.useLoaderData();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;

    if (!title) return;

    try {
      await createTodo({ data: { title } });
      router.invalidate();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  return (
    <MainPage title="Todos" desc="A small starter with room to grow.">
      <ul className="space-y-3 mb-6">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="rounded-lg px-3 py-2 transition-all hover:scale-[1.02] cursor-pointer group border"
          >
            <div className="flex items-center justify-between">
              <span className="text-md font-medium text-[var(--sea-ink)] group-hover:text-indigo-200 transition-colors">
                {todo.title}
              </span>
              <span className="text-xs text-[var(--sea-ink)]">#{todo.id}</span>
            </div>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="text-center py-8 text-[var(--sea-ink)]">
            No todos yet. Create one below!
          </li>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all placeholder-indigo-300/50"
        />
        <button
          type="submit"
          className="px-6 py-3 font-semibold rounded-lg border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)] disabled:opacity-50 active:scale-95 whitespace-nowrap"
        >
          Add Todo
        </button>
      </form>

      <div className="mt-8 p-6 rounded-lg border border-[var(--line)]">
        <h3 className="text-lg text-base font-semibold mb-2 text-[var(--sea-ink)]">
          Powered by Prisma ORM
        </h3>
        <p className="text-sm text-[var(--sea-ink-soft)] mb-4">
          Next-generation ORM for Node.js & TypeScript with PostgreSQL
        </p>
        <div className="space-y-2 text-sm">
          <p className="text-[var(--sea-ink-soft)] font-medium">
            Setup Instructions:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-[var(--sea-ink-soft)]">
            <li>
              Configure your{" "}
              <code className="px-2 py-1 rounded bg-black/30 text-purple-500">
                DATABASE_URL
              </code>{" "}
              in .env.local
            </li>
            <li>
              Run:{" "}
              <code className="px-2 py-1 rounded bg-black/30 text-purple-500">
                npx -y prisma generate
              </code>
            </li>
            <li>
              Run:{" "}
              <code className="px-2 py-1 rounded bg-black/30 text-purple-500">
                npx -y prisma db push
              </code>
            </li>
            <li>
              Optional:{" "}
              <code className="px-2 py-1 rounded bg-black/30 text-purple-500">
                npx -y prisma studio
              </code>
            </li>
          </ol>
        </div>
      </div>
    </MainPage>
  );
}
