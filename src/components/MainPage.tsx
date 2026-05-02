import type React from "react";

export default function MainPage({
  children,
  title,
  desc,
}: {
  children: React.ReactNode;
  title: string;
  desc?: string;
}) {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <h1 className="display-title mb-1 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          {desc}
        </p>
        <div className="mt-5">{children}</div>
      </section>
    </main>
  );
}
