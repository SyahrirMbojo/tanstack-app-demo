import type { MetaModel } from "#/prisma.extension";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { useMemo, type ChangeEventHandler } from "react";

export type TableColumnModel = {
  title: string;
  align?: "text-left" | "center" | "text-right";
};

export default function TableView({
  children,
  columns,
  pagination,
  onChangePage,
  onBackPaging,
  onNextPaging,
}: {
  children: React.ReactNode;
  columns?: TableColumnModel[];
  pagination?: MetaModel;
  onChangePage?: ChangeEventHandler<HTMLSelectElement> | undefined;
  onBackPaging?: () => void;
  onNextPaging?: () => void;
}) {
  const rowStart = useMemo(() => {
    if (pagination?.total === 0) {
      return 0;
    }

    return (pagination!.current_page - 1) * pagination!.per_page + 1;
  }, [pagination?.current_page, pagination?.per_page, pagination?.total]);

  const rowEnd = Math.min(
    pagination!.current_page * pagination!.per_page,
    pagination!.total,
  );

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-collapse text-left text-sm">
          <thead className="bg-[rgba(79,184,178,0.12)] text-xs uppercase text-[var(--sea-ink-soft)]">
            <tr>
              {columns?.map((col, index) => {
                return (
                  <th
                    key={index}
                    className={`px-4 py-3 font-bold ${col.align}`}
                  >
                    {col.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">{children}</tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--line)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[var(--sea-ink-soft)]">
          Showing {rowStart}-{rowEnd} of {pagination?.total}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={pagination?.per_page}
            onChange={onChangePage}
            className="h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-2 text-sm text-[var(--sea-ink)] outline-none"
            aria-label="Rows per page"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onBackPaging}
            disabled={pagination!.current_page <= 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-24 text-center text-sm font-semibold text-[var(--sea-ink)]">
            {pagination?.current_page} / {pagination?.total_page}
          </span>
          <button
            type="button"
            onClick={onNextPaging}
            disabled={pagination!.current_page >= pagination!.total_page}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
