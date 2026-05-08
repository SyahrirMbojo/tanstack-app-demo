import React from "react";

export default function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 text-[var(--sea-ink-soft)] ${className}`}>
      {children}
    </td>
  );
}
