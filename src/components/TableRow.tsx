import type React from "react";

export default function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="bg-transparent transition hover:bg-[rgba(79,184,178,0.08)]">
      {children}
    </tr>
  );
}
