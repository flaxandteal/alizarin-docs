"use client";

import * as React from 'react';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import AlizarinInternal from './alizarin-internal.tsx';

export default function AlizarinInternalResult({module, block}: {module: string, block: string}) {
  const [run, setRun] = React.useState<React.ReactNode>(null);
  const filename = module.split('/').filter(Boolean).pop() ?? 'example';

  return (
    <div id='alizarin-testbed' className='alizarin-example not-prose'>
      <div className='alizarin-example-head'>
        <span className='filename'>{filename}</span>
        <span className='alizarin-example-live'>
          <span className='dot' />
          live in your browser
        </span>
      </div>
      <div className='alizarin-example-body'>
        <div className='alizarin-code'>
          <DynamicCodeBlock code={block} lang='tsx' />
        </div>
        <div className='alizarin-run-box'>
          <AlizarinInternal module={module} setRun={setRun} />
          {run &&
            <div className='alizarin-scratchspace'>{run}</div>
          }
        </div>
      </div>
    </div>
  );
}
