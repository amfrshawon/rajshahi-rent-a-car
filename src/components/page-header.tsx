/**
 * Shared page header band for the inner pages. A thin brand kicker rule over
 * a big editorial title — quiet, light, and it rises in on load without
 * fading (translate only, so LCP text attribution is not deferred).
 */
export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="bg-surface border-border border-b">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <p aria-hidden="true" className="bg-brand-vivid mb-4 h-1 w-10 rounded-full" />
        <h1 className="text-fg text-3xl font-semibold md:text-5xl">{title}</h1>
        {lead ? (
          <p className="text-muted mt-4 max-w-2xl md:text-lg">{lead}</p>
        ) : null}
      </div>
    </div>
  );
}
