/**
 * Strips document-scope markup out of WordPress content before it is inlined.
 *
 * This is not paranoia about a third party — it is the owner's own CMS. The
 * /ambulance-service/ page carried a 6.8 KB <style> block containing a `*`
 * reset and `body { font-family: 'Segoe UI' }`. Inlined into the page it wiped
 * spacing site-wide and replaced the Bangla face with one that has no Bengali
 * glyphs at all. Page content must not be able to restyle the shell around it.
 *
 * Runs at build time, so it costs nothing at runtime.
 *
 * Inline `style=` attributes are kept, minus their colour declarations. The
 * same ambulance page hardcodes `color: #ffffff !important` on its heading,
 * which was legible only against the hero background defined in that deleted
 * stylesheet — inlined here it rendered white on white. Colours now come from
 * the theme; layout declarations such as text-align are left alone.
 */
const COLOUR_DECLARATION = /^(?:color|background|background-color|background-image|text-shadow|-webkit-text-fill-color)\s*:/i;

function stripColours(css: string): string {
  const kept = css
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .filter((d) => !COLOUR_DECLARATION.test(d));
  return kept.join("; ");
}
export function sanitizeWordPressHtml(html: string): string {
  return (
    html
      // Document-scope styling and behaviour.
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<link\b[^>]*>/gi, "")
      .replace(/<meta\b[^>]*>/gi, "")
      // Structural tags that would nest illegally inside an article.
      .replace(/<\/?(?:html|head|body)\b[^>]*>/gi, "")
      // Inline event handlers.
      .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
      .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
      .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
      // Colour declarations inside inline styles.
      .replace(/\sstyle\s*=\s*"([^"]*)"/gi, (_m, css: string) => {
        const kept = stripColours(css);
        return kept ? ` style="${kept}"` : "";
      })
      .replace(/\sstyle\s*=\s*'([^']*)'/gi, (_m, css: string) => {
        const kept = stripColours(css);
        return kept ? ` style="${kept}"` : "";
      })
      .trim()
  );
}
