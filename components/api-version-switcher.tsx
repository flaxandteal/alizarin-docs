'use client';

import { usePathname, useRouter } from 'next/navigation';

const versions = [
  { id: 'stable', label: 'Stable' },
  { id: 'alpha', label: 'Alpha' },
] as const;

export function ApiVersionSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const current = versions.find(v => pathname.includes(`/api/${v.id}`))?.id;

  function switchVersion(target: string) {
    if (current) {
      // Replace /api/stable/... with /api/alpha/... (or vice versa)
      const newPath = pathname.replace(`/api/${current}`, `/api/${target}`);
      router.push(newPath);
    } else {
      // On the /api index page, navigate into the target
      router.push(`/docs/api/${target}`);
    }
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
      {versions.map(v => (
        <button
          key={v.id}
          onClick={() => switchVersion(v.id)}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--fd-border)',
            background: current === v.id ? 'var(--fd-primary)' : 'transparent',
            color: current === v.id ? 'var(--fd-primary-foreground)' : 'inherit',
            cursor: 'pointer',
            fontWeight: current === v.id ? 600 : 400,
          }}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
