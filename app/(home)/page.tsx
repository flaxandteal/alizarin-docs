"use client";

import Link from 'next/link';
import Image from 'next/image';
import banner from '../../public/banner.png';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <div className="image-column">
        <div className="image-container">
          <Image sizes="{(max-width: 1250px) 100vw, 1250px" src={banner} alt="Alizarin: fast JS knowledge graphs"/>
        </div>
      </div>
      <h1 className="mb-4 text-2xl font-bold">Alizarin: fast JS/TS knowledge graphs</h1>
      <p className="text-fd-muted-foreground">
        You can open{' '}
        <Link
          href="/docs"
          className="text-fd-foreground font-semibold underline"
        >
          /docs
        </Link>{' '}
        and see the documentation.
      </p>
      <style jsx>{`
      .image-column > div {
        margin: 0 auto;
        display: inline-block;
      }
      .image-column {
        text-align: center;
      }
      `}</style>
    </main>
  );
}
