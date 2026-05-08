export default function TableEmpty({
  colSpan,
  message = "No data found",
}: {
  colSpan?: number | undefined;
  message?: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-sm text-[var(--sea-ink-soft)]"
      >
        {message}
      </td>
    </tr>
  );
}
