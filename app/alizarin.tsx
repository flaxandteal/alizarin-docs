import * as React from 'react';
import { readFile } from 'fs/promises'
import AlizarinInternalResult from './alizarin-internal-result.tsx';

export default function Alizarin({module}: {module: string}) {
  return async function () {
    const file = await readFile(process.cwd() + `/content/docs${module}`, 'utf8');
    const lines = file.split('\n');
    const buffer = [];
    // TODO just stream it
    let inSnippet = false;
    for (const line of lines) {
      if (line.trim() === '// @alizarin-code-begin') {
        inSnippet = true;
      } else if (line.trim() === '// @alizarin-code-end') {
        break;
      } else if (inSnippet) {
        buffer.push(line);
      }
    }
    const block = buffer.join('\n');
    return (
      <AlizarinInternalResult module={module} block={block} />
    );
  }();
}
