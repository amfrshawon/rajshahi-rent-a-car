/**
 * Page header for the inner pages.
 *
 * No band, no short green rule above the title — that grey strip with a green
 * bar was a stock device repeated on every page. The title now sits directly
 * on the page ground with room around it, and nothing here animates.
 */
export function PageHeader({
  title,
  lead,
  eyebrow,
}: {
  title: string;
  lead?: string;
  eyebrow?: string;
}) {
  return (
    <header className="mx-auto w-full max-w-6xl px-4 pt-10 pb-6 md:px-6 md:pt-14 md:pb-8">
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h1 className="text-fg text-3xl font-bold md:text-5xl">{title}</h1>
      {lead ? <p className="text-muted mt-3 max-w-2xl text-lg">{lead}</p> : null}
    </header>
  );
}
