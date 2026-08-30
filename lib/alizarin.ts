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

// Registry of runnable examples. Each module under content/docs/example/ exports
// a default `{ run }` whose body is the code block shown on the page. Add an
// entry here when adding a new runnable snippet — the key must match the
// `<AlizarinComponent module='/example/<key>.tsx'>` embedded on the page.
type RunnableExample = { default: { run: () => Promise<React.ReactNode> } };
const EXAMPLES: Record<string, () => Promise<RunnableExample>> = {
  'example-1': () => import('../content/docs/example/example-1'),
  'example-2': () => import('../content/docs/example/example-2'),
  'example-3': () => import('../content/docs/example/example-3'),
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
