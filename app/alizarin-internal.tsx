import { testAlizarin } from '@/lib/alizarin';
import * as React from 'react';

export default function AlizarinInternal({module, setRun}: {module: string, setRun: React.Dispatch<React.SetStateAction<React.ReactNode>>}): React.ReactNode {
  return (
    <button type='button'
      onClick={ () => {
        const result = testAlizarin(module);
        if (result) {
          result.then((node: React.ReactNode) => node && setRun(node))
        }
      } }
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7Z"></path></svg>
      Run this example
    </button>
  );
}
