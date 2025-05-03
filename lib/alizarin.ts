import { AlizarinModel, client, graphManager, staticStore, RDM } from '../package/dist/alizarin.js';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;

let initialized = false;
export function testAlizarin() {
  if (initialized) {
    return;
  }
  initialized = true;
  const archesClient = new client.ArchesClientRemoteStatic(BASE_PATH || "", {
    allGraphFile: (() => 'example/resource_models/_all.json'),
    graphIdToGraphFile: ((graphId: string) => `example/resource_models/${graphId}.json`),
    resourceIdToFile: ((resourceId: string) => `example/business_data/${resourceId}.json`),
    collectionIdToFile: ((collectionId: string) => `example/collections/${collectionId}.json`)
  });
  graphManager.archesClient = archesClient;
  staticStore.archesClient = archesClient;
  RDM.archesClient = archesClient;

  console.log('Initializing Alizarin');
  graphManager.initialize().then(async () => {
    class Talk extends AlizarinModel<Talk> {};
    const Talks = await graphManager.get(Talk);

    class Institution extends AlizarinModel<Institution> {};
    const Institutions = await graphManager.get(Institution);

    class Session extends AlizarinModel<Session> {};
    const Sessions = await graphManager.get(Session);

    class Person extends AlizarinModel<Person> {};
    const Persons = await graphManager.get(Person);

    const scratchspace = document.getElementById('alizarin-scratchspace');
    if (scratchspace) {
      let html = '';
      for (const graph of [Talks, Institutions, Sessions, Persons]) {
        html += `
        <pre>
Talks:
  - ${[...graph.getNodeObjectsByAlias().entries().filter(([k]) => k).map(([k, v]) => `${k}: ${v.datatype}`)].join('\n  - ')}
        </pre>
        `;
      }
      scratchspace.innerHTML = html;
    }
  });
}
