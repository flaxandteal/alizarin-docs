import * as React from 'react';
import { readFile } from 'fs/promises'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import AlizarinInternal from './alizarin-internal.tsx';

export default async function Alizarin({module}: {module: string}) {
  const file = await readFile(process.cwd() + `/content/docs${module}`, 'utf8');
  const lines = file.split('\n');
  const buffer = [];
  // TODO just stream it
  let inSnippet = false;
  for (const line of lines) {
    if (line.trim() === '// @alizcode-begin') {
      inSnippet = true;
    } else if (line.trim() === '// @alizcode-end') {
      break;
    } else if (inSnippet) {
      buffer.push(line);
    }
  }
  const block = buffer.join('\n');
  return (
    <div id='alizarin-testbed'>
      <AlizarinInternal module={module}/>
      <div className='alizarin-code'>
        <DynamicCodeBlock code={block} lang='ts' />
      </div>
      <div id='alizarin-scratchspace'></div>
    </div>
  );
}
