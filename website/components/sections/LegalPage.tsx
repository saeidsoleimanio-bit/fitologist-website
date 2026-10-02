/** Shared layout for /terms and /privacy: solid header, plain dark page, readable column. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      aria-labelledby="legal-title"
      className="section-y relative bg-ink pt-[calc(var(--header-compact)+2rem)] lg:pt-[calc(var(--header-h)+3rem)]"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-8 rtl:pr-6 rtl:sm:pr-10">
        <h1 id="legal-title" className="display text-[clamp(2.4rem,8vw,4.25rem)] leading-[0.95] text-bone text-balance">
          {title}
        </h1>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
