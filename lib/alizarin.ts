import { client, graphManager, staticStore, RDM } from '../package/dist/alizarin.js';
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import {unified} from 'unified'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;

let initialized = false;
export function testAlizarin(module: string) {
  if (initialized) {
    return;
  }
  console.log(module, fetch(module));
  initialized = true;
  const archesClient = new client.ArchesClientRemoteStatic(BASE_PATH || "", {
    allGraphFile: (() => 'example/resource_models/_all.json'),
    graphIdToGraphFile: ((graphId: string) => `example/resource_models/${graphId}.json`),
    graphIdToResourcesFiles: ((graphId: string) => [`example/business_data/_${graphId}.json`]),
    resourceIdToFile: ((resourceId: string) => `example/business_data/${resourceId}.json`),
    collectionIdToFile: ((collectionId: string) => `example/collections/${collectionId}.json`)
  });
  graphManager.archesClient = archesClient;
  staticStore.archesClient = archesClient;
  RDM.archesClient = archesClient;

  console.log('Initializing Alizarin');
  graphManager.initialize().then(async () => {
    const scratchspace = document.getElementById('alizarin-scratchspace');
    import(`../content/docs/example/example-1.ts`).then((result) => {
      let buffer = '';
      function print(...inp: any[]): void {
        const line = [];
        for (const cmpt of inp) {
          line.push(`${cmpt}`);
        }
        buffer += line.join(' ') + '\n';
      }
      result.default.run({print}).then(async () => {
        if (scratchspace) {
          const file = await unified().use(remarkParse).use(remarkRehype).use(remarkStringify).parse(buffer);
          console.log(file);
          scratchspace.innerHTML = String("<pre>" + buffer + "</pre>");
        }
      });
    });
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
}
