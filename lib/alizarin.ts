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

// Registry of runnable examples. Each module under content/docs/example/ exports
// a default `{ run }` whose body is the code block shown on the page. Add an
// entry here when adding a new runnable snippet — the key must match the
// `<AlizarinComponent module='/example/<key>.tsx'>` embedded on the page.
type RunnableExample = { default: { run: () => Promise<React.ReactNode> } };
const EXAMPLES: Record<string, () => Promise<RunnableExample>> = {
  'example-1': () => import('../content/docs/example/example-1'),
  'example-2': () => import('../content/docs/example/example-2'),
  'example-3': () => import('../content/docs/example/example-3'),
  'example-4': () => import('../content/docs/example/example-4'),
  'example-5': () => import('../content/docs/example/example-5'),
  'example-6': () => import('../content/docs/example/example-6'),
  'example-7': () => import('../content/docs/example/example-7'),
  'example-8': () => import('../content/docs/example/example-8'),
  'example-9': () => import('../content/docs/example/example-9'),
  'example-10': () => import('../content/docs/example/example-10'),
  'example-11': () => import('../content/docs/example/example-11'),
  'example-12': () => import('../content/docs/example/example-12'),
  'example-13': () => import('../content/docs/example/example-13'),
  'example-14': () => import('../content/docs/example/example-14'),
  'example-15': () => import('../content/docs/example/example-15'),
  'example-16': () => import('../content/docs/example/example-16'),
  'example-17': () => import('../content/docs/example/example-17'),
};

// "/example/example-1.tsx" -> "example-1"
function exampleName(module: string): string {
  return module.replace(/^\/example\//, '').replace(/\.tsx?$/, '');
}

// Run the snippet for a given docs `module` and return its rendered result.
// Setup is cached; each click re-runs the snippet itself.
export function testAlizarin(module: string = '/example/example-1.tsx'): Promise<React.ReactNode> {
  const name = exampleName(module);
  const load = EXAMPLES[name];
  if (!load) {
    return Promise.resolve(
      React.createElement(
        'div',
        { className: 'alizarin-error' },
        `No runnable example registered for "${name}" — add it to EXAMPLES in lib/alizarin.ts.`
      )
    );
  }
  return ensureSetup()
    .then(load)
    .then((mod) => mod.default.run());
}
