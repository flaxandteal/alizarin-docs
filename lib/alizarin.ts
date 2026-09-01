import * as React from 'react';

type AlizarinModule = typeof import('alizarin');

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;

// Configure the shared alizarin singletons against the docs' static example
// data. Done once and reused across every snippet run.
let setup: Promise<void> | null = null;
function ensureSetup(): Promise<void> {
  if (setup) {
    return setup;
  }
  setup = import('alizarin').then(async (alizarin: AlizarinModule) => {
    const { client, graphManager, staticStore, RDM, initWasm } = alizarin;
    // The WASM core must be loaded before anything touches the resource registry
    // (setting archesClient builds it). The package auto-inits on a microtask, but
    // we await explicitly so setup never races ahead of a ready WASM module.
    await initWasm();
    // Register out-of-tree datatype handlers (they self-register on wasmReady):
    // CLM adds `reference`, filelist adds `file-list`.
    await import('@alizarin/clm');
    await import('@alizarin/filelist');
    const archesClient = new client.ArchesClientRemoteStatic(BASE_PATH || "", {
      allGraphFile: (() => 'docs/example/resource_models/_all.json'),
      graphIdToGraphFile: ((graphId: string) => `docs/example/resource_models/${graphId}.json`),
      graphIdToResourcesFiles: ((graphId: string) => [`docs/example/business_data/_${graphId}.json`]),
      resourceIdToFile: ((resourceId: string) => `docs/example/business_data/${resourceId}.json`),
      collectionIdToFile: ((collectionId: string) => `docs/example/collections/${collectionId}.json`)
    });
    graphManager.archesClient = archesClient;
    staticStore.archesClient = archesClient;
    RDM.archesClient = archesClient;
    await graphManager.initialize();
  });
  return setup;
}

// Load every Site's boundary as one GeoJSON FeatureCollection, each feature
// tagged with its site name — drives the live map on the Geospatial page.
export async function loadSiteBoundaries(): Promise<{ type: 'FeatureCollection'; features: unknown[] }> {
  await ensureSetup();
  const { graphManager } = await import('alizarin');
  const Sites = await graphManager.get('Site');
  const sites = await Sites.all();
  const features: unknown[] = [];
  for (const site of sites) {
    const s = site as unknown as { boundary: Promise<{ features?: { properties?: Record<string, unknown> }[] }>; name: Promise<unknown> };
    const boundary = await s.boundary;
    const name = String(await s.name);
    for (const f of boundary?.features ?? []) {
      features.push({ ...f, properties: { ...(f.properties ?? {}), name } });
    }
  }
  return { type: 'FeatureCollection', features };
}

// Runnable examples live in an `examples/` folder beside each page's .mdx
// (content/docs/<section>/examples/<name>.tsx), each a default-exported `{ run }`
// whose body is the code block shown on the page. They are AUTO-DISCOVERED — no
// registry to maintain. The template-literal import below makes webpack
// code-split every matching file into its own lazy chunk, fetched only when its
// ▶ button is clicked (adding an example needs no edit here).
type RunnableExample = { default: { run: () => Promise<React.ReactNode> } };

// The `module` is the path under content/docs the page embeds, e.g.
// "/types/examples/basic-scalars.tsx". Strip the leading slash + extension:
// "/types/examples/basic-scalars.tsx" -> "types/examples/basic-scalars"
function examplePath(module: string): string {
  return module.replace(/^\//, '').replace(/\.tsx?$/, '');
}

// Run the snippet for a given docs `module` and return its rendered result.
// Setup is cached; each click re-runs the snippet itself.
export function testAlizarin(
  module: string = '/examples/quickstart-relationships.tsx'
): Promise<React.ReactNode> {
  const path = examplePath(module);
  if (!/(^|\/)examples\/[^/]+$/.test(path)) {
    return Promise.resolve(
      React.createElement(
        'div',
        { className: 'alizarin-error' },
        `Not a runnable example: "${module}" (expected …/examples/<name>.tsx).`
      )
    );
  }
  return ensureSetup()
    .then(
      () =>
        import(
          /* webpackInclude: /examples\/[^/]+\.tsx$/ */
          `../content/docs/${path}`
        ) as Promise<RunnableExample>
    )
    .then((mod) => mod.default.run());
}
