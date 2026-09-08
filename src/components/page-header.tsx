export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="bg-brand-soft">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
        <h1 className="text-fg text-3xl font-semibold md:text-4xl">{title}</h1>
        {lead ? <p className="text-muted mt-3 max-w-2xl">{lead}</p> : null}
      </div>
    </div>
  );
}
