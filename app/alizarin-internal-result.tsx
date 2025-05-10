"use client";

import * as React from 'react';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import AlizarinInternal from './alizarin-internal.tsx';

export default function AlizarinInternalResult({module, block}: {module: string, block: string}) {
  const [run, setRun] = React.useState<React.ReactNode>(null);
  return function () {
    return (
      <div id='alizarin-testbed'>
        <AlizarinInternal module={module} setRun={setRun}/>
        <div className='alizarin-code'>
          <DynamicCodeBlock code={block} lang='tsx' />
        </div>
        { run &&
          <div className='alizarin-scratchspace overflow-hidden rounded-lg border bg-fd-secondary/50 text-sm my-10 shiki shiki-themes github-light github-dark'>{ run }</div>
        }
      </div>
    );
  }();
}
