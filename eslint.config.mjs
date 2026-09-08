import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /*
       * This project is a static export with `images.unoptimized`, so there is
       * no runtime image optimiser for next/image to use — it would add markup
       * and client JS while optimising nothing. Responsive AVIF/WebP is
       * pre-generated instead (scripts/generate-images.mts) and served through
       * a plain <picture>, so <img> is the correct element here.
       */
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
