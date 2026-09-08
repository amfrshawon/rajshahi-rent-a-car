/**
 * Emits a JSON-LD block. The payload is built by src/lib/schema.ts from our
 * own configuration, never from user input.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
