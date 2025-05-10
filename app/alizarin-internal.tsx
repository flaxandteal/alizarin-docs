import { testAlizarin } from '@/lib/alizarin';
import * as React from 'react';

export default function AlizarinInternal({module, setRun}: {module: string, setRun: React.Dispatch<React.SetStateAction<React.ReactNode>>}): React.ReactNode {
  console.log('TODO', module);
  return (
      <div className='alizarin-run-box'>
        <button type='button'
          className='px-5 py-4 text-xs font-medium text-center text-white hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:hover:bg-gray-700 dark:focus:ring-gray-800'
          onClick={ () => {
            const result = testAlizarin();
            // const result = testAlizarin(module);
            if (result) {
              result.then((node: React.ReactNode) => node && setRun(node))
            }
          } }
        >
          <span>&#x25B6;</span>
        </button>
      </div>
  );
}
