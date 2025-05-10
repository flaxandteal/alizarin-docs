import * as React from 'react';
import { type GraphManager } from 'alizarin';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import {unified} from 'unified';
import example1 from '../content/docs/example/example-1';

type AlizarinModule = typeof import('alizarin');

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;

let initialized: Promise<React.ReactNode> | null = null;
export function testAlizarin(module: string): Promise<React.ReactNode> | null {
  if (initialized) {
    return initialized;
  }
  initialized = import('alizarin').then(async (alizarin: AlizarinModule) => {
    const { client, graphManager, staticStore, RDM } = await alizarin;
    const archesClient = new client.ArchesClientRemoteStatic(BASE_PATH || "", {
      allGraphFile: (() => 'package/docs/example/resource_models/_all.json'),
      graphIdToGraphFile: ((graphId: string) => `package/docs/example/resource_models/${graphId}.json`),
      graphIdToResourcesFiles: ((graphId: string) => [`package/docs/example/business_data/_${graphId}.json`]),
      resourceIdToFile: ((resourceId: string) => `package/docs/example/business_data/${resourceId}.json`),
      collectionIdToFile: ((collectionId: string) => `package/docs/example/collections/${collectionId}.json`)
    });
    graphManager.archesClient = archesClient;
    staticStore.archesClient = archesClient;
    RDM.archesClient = archesClient;

    console.log('Initializing Alizarin');
    return graphManager;
  }).then((graphManager: GraphManager) => {
    return graphManager.initialize()
  }).then(() => {
      return example1.run();
      // if (scratchspace) {
      //   let html = '';
      //   for (const graph of [Talks, Institutions, Sessions, Persons]) {
      //     html += `
      //     <pre>
      // Talks:
      // - ${[...graph.getNodeObjectsByAlias().entries().filter(([k]) => k).map(([k, v]) => `${k}: ${v.datatype}`)].join('\n  - ')}
      //     </pre>
      //     `;
      //   }
      //   scratchspace.innerHTML = html;
      // }
  });
  return initialized;
}
