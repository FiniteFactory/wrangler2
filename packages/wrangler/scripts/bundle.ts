import { build } from "esbuild";
import path from "path";
import { appendFileSync } from "fs";

// the expectation is that this is being run from the project root

async function run() {
  // main cli
  await build({
    entryPoints: ["./src/cli.ts"],
    bundle: true,
    outdir: "./wrangler-dist",
    platform: "node",
    format: "cjs",
    // minify: true, // TODO: enable this again
    external: ["fsevents", "esbuild", "miniflare", "@miniflare/core"], // todo - bundle miniflare too
    sourcemap: "external",
    inject: [path.join(__dirname, "../import_meta_url.js")],
    define: {
      "import.meta.url": "import_meta_url",
    },
  }).then(() => {
    appendFileSync(
      "./wrangler-dist/cli.js",
      `//# sourceMappingURL=/cli.js.map`
    );
  });
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
