import type { UserFormInput } from "#/routes/_authenticated/users/_server/-users";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

type UserFormProps = {
  initialValue: UserFormInput;
  mode: "create" | "edit";
  onCancel: () => void;
  onSubmit: (data: UserFormInput) => Promise<void>;
};

export default function UserForm({
  initialValue,
  mode,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const [form, setForm] = useState<UserFormInput>(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan user");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            required
            className="form-input"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="form-input"
          />
        </Field>
        <Field label="Phone">
          <input
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
            className="form-input"
          />
        </Field>
        <Field label="Username">
          <input
            value={form.username}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, username: event.target.value }))
            }
            required
            className="form-input"
          />
        </Field>
        <Field label="Gender">
          <select
            value={form.gender}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, gender: event.target.value }))
            }
            required
            className="form-input"
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
            <option value="other">Lainnya</option>
          </select>
        </Field>
        <Field label={mode === "edit" ? "New Password" : "Password"}>
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            required={mode === "create"}
            minLength={form.password ? 6 : undefined}
            className="form-input"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address">
            <textarea
              value={form.address}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, address: event.target.value }))
              }
              rows={4}
              className="form-input resize-none"
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[var(--sea-ink-soft)] transition hover:bg-[rgba(79,184,178,0.1)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[rgba(50,143,151,0.3)] bg-[var(--lagoon-deep)] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--palm)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[var(--sea-ink-soft)]">
        {label}
      </span>
      {children}
    </label>
  );
}
