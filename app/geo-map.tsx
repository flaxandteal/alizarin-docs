'use client';

import { useEffect, useRef, useState } from 'react';
import { loadSiteBoundaries } from '@/lib/alizarin';
import 'maplibre-gl/dist/maplibre-gl.css';

// Live map: runs Alizarin in the browser to load every Site's GeoJSON boundary,
// then renders them on a MapLibre + OpenStreetMap basemap.
export default function GeoMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Loading boundaries…');

  useEffect(() => {
    let map: { remove: () => void } | undefined;
    let cancelled = false;

    (async () => {
      try {
        const maplibregl = await import('maplibre-gl');
        // Webpack can't emit maplibre's worker (its filename is built at runtime),
        // and the default import.meta.url path resolves to the page under basePath.
        // Serve the worker from /public and point maplibre at it explicitly.
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
        maplibregl.setWorkerUrl(`${basePath}/maplibre/maplibre-gl-worker.mjs`);
        const fc = await loadSiteBoundaries() as {
          features: { geometry: { type: string; coordinates: number[][][] | number[][][][] } }[];
        };
        if (cancelled || !ref.current) return;

        const m = new maplibregl.Map({
          container: ref.current,
          style: {
            version: 8,
            sources: {
              osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors',
              },
            },
            layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
          },
          center: [80.25, 13.08],
          zoom: 10,
        });
        map = m;

        m.on('load', () => {
          m.addSource('sites', { type: 'geojson', data: fc as GeoJSON.FeatureCollection });
          m.addLayer({ id: 'sites-fill', type: 'fill', source: 'sites', paint: { 'fill-color': '#2a9d8f', 'fill-opacity': 0.3 } });
          m.addLayer({ id: 'sites-line', type: 'line', source: 'sites', paint: { 'line-color': '#21867a', 'line-width': 2 } });

          const b = new maplibregl.LngLatBounds();
          for (const f of fc.features) {
            const g = f.geometry;
            const rings = g.type === 'Polygon'
              ? (g.coordinates as number[][][])
              : g.type === 'MultiPolygon'
                ? (g.coordinates as number[][][][]).flat()
                : [];
            for (const ring of rings) for (const c of ring) b.extend(c as [number, number]);
          }
          if (!b.isEmpty()) m.fitBounds(b, { padding: 30, maxZoom: 14 });
          setStatus(`${fc.features.length} site boundaries — pan/zoom the map`);
        });
      } catch (e) {
        setStatus(`Error: ${(e as Error)?.message ?? String(e)}`);
      }
    })();

    return () => { cancelled = true; map?.remove(); };
  }, []);

  return (
    <div className="alizarin-example not-prose">
      <div className="alizarin-example-head">
        <span className="filename">Site boundaries</span>
        <span className="alizarin-example-live"><span className="dot" /> live in your browser</span>
      </div>
      <div ref={ref} style={{ height: 420, width: '100%' }} />
      <div className="alizarin-run-box"><div className="alizarin-scratchspace">{status}</div></div>
    </div>
  );
}
