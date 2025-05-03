"use client";

import { testAlizarin } from '@/lib/alizarin';

export default function Alizarin() {
  return (
    <div id='alizarin-testbed'>
      <div id='alizarin-scratchspace'></div>
      <button onClick={ () => testAlizarin() }>Show Alizarin</button>
    </div>
  );
}
