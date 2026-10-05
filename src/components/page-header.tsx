import type { ReactNode } from "react";

/**
 * Opening of every inner page: a large title on the page ground, an
 * optional short lead, and an optional row of actions. No band, no accent
 * bar; the type carries it. Nothing here animates, so it paints at once.
 */
export function PageHeader({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <div className="wrap pt-10 pb-10 md:pt-20 md:pb-14">
      <h1 className="text-title max-w-4xl">{title}</h1>
      {lead ? <p className="text-ink-soft text-lead mt-5 max-w-2xl">{lead}</p> : null}
      {children ? <div className="mt-7 flex flex-wrap gap-3">{children}</div> : null}
    </div>
  );
}

/** Heading block for a section: title, optional lead, optional link at the end. */
export function SectionHead({
  title,
  lead,
  id,
  action,
}: {
  title: string;
  lead?: string;
  id?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 md:mb-12">
      <div className="max-w-2xl">
        <h2 id={id} className="text-section">
          {title}
        </h2>
        {lead ? <p className="text-ink-soft mt-3 md:text-lg">{lead}</p> : null}
      </div>
      {action}
    </div>
  );
}
