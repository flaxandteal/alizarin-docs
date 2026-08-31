'use client';

import { testAlizarin } from '@/lib/alizarin';
import * as React from 'react';

export default function AlizarinInternal({module, setRun}: {module: string, setRun: React.Dispatch<React.SetStateAction<React.ReactNode>>}): React.ReactNode {
  const [running, setRunning] = React.useState(false);
  return (
    <button type='button'
      disabled={ running }
      onClick={ () => {
        setRunning(true);
        setRun(<div className='alizarin-scratchspace'>Running…</div>);
        Promise.resolve()
          .then(() => testAlizarin(module))
          .then((node: React.ReactNode) => {
            setRun(node ?? <div className='alizarin-scratchspace'>(no output)</div>);
          })
          .catch((e: unknown) => {
            // Surface setup/run errors instead of failing silently.
            setRun(
              <div className='alizarin-error'>
                Error: { e instanceof Error ? e.message : String(e) }
              </div>
            );
          })
          .finally(() => setRunning(false));
      } }
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7Z"></path></svg>
      { running ? 'Running…' : 'Run this example' }
    </button>
  );
}
