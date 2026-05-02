/**
 * Generates versioned API reference docs from alizarin TypeScript sources.
 * Clones alizarin at the latest stable tag and at main (alpha),
 * runs TypeDoc with typedoc-plugin-markdown for each, and outputs
 * MDX files into content/docs/api/stable/ and content/docs/api/alpha/.
 *
 * Environment variables:
 *   STABLE_TAG - Git tag for stable version (e.g., "v1.0.0"). If empty/unset, stable is skipped.
 *   ALIZARIN_REPO - Repository URL (default: https://github.com/flaxandteal/alizarin.git)
 */
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const contentApiDir = join(root, 'content', 'docs', 'api');

const REPO = process.env.ALIZARIN_REPO || 'https://github.com/flaxandteal/alizarin.git';
const STABLE_TAG = process.env.STABLE_TAG || '';

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
}

function generateForVersion(version, ref) {
  const tmpDir = `/tmp/alizarin-${version}`;
  const outDir = join(contentApiDir, version);

  // Clean previous output
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true });
  }
  mkdirSync(outDir, { recursive: true });

  // Clone at specific ref
  if (existsSync(tmpDir)) {
    rmSync(tmpDir, { recursive: true });
  }

  console.log(`\n=== Generating API docs for ${version} (ref: ${ref}) ===\n`);

  run(`git clone --depth 1 --branch ${ref} ${REPO} ${tmpDir}`);

  // Install dependencies (needed for TS type resolution)
  run('npm ci', { cwd: tmpDir });

  // Create pkg/ type stubs if not present (avoids needing full WASM build)
  const pkgDir = join(tmpDir, 'pkg');
  const pkgDts = join(pkgDir, 'alizarin.d.ts');
  if (!existsSync(pkgDts)) {
    mkdirSync(pkgDir, { recursive: true });
    writeFileSync(pkgDts, [
      '// Auto-generated stub for TypeDoc (avoids needing WASM build)',
      'export default function init(input?: any): Promise<any>;',
      'export function initSync(input?: any): any;',
      'export class StaticNode { [key: string]: any; }',
      'export class StaticGraphMeta { [key: string]: any; }',
      'export class StaticTranslatableString { [key: string]: any; }',
      'export class WasmRdmCache { [key: string]: any; }',
      'export function getRscvTimings(): any;',
      'export function parseSkosXml(xml: string): any;',
      'export function parseSkosXmlToCollection(xml: string, id: string): any;',
      'export function collectionToSkosXml(collection: any): string;',
      'export function collectionsToSkosXml(collections: any): string;',
      'export function registerExtensionHandler(datatype: string, handler: any): void;',
      'export function printWasmTimings(): void;',
      'export function clearWasmTimings(): void;',
      'export function printRscvTimings(): void;',
      'export function clearRscvTimings(): void;',
      '',
    ].join('\n'));
    console.log('Created pkg/alizarin.d.ts stub for TypeDoc');
  }

  // Ensure a TypeDoc-compatible tsconfig exists (older refs may not have one)
  const typedocTsconfig = join(tmpDir, 'tsconfig.typedoc.json');
  if (!existsSync(typedocTsconfig)) {
    writeFileSync(typedocTsconfig, JSON.stringify({
      extends: './tsconfig.json',
      include: ['js'],
      exclude: ['tests', 'node_modules', 'pkg', 'dist'],
    }, null, 2) + '\n');
    console.log('Created tsconfig.typedoc.json (not present in this ref)');
  }

  // Check that typedoc.json exists in the cloned repo
  const typedocConfig = join(tmpDir, 'typedoc.json');
  const hasConfig = existsSync(typedocConfig);
  if (!hasConfig) {
    console.warn(`Warning: typedoc.json not found in ${ref}, using defaults`);
  }

  // Run TypeDoc from the docs repo root (where plugins are installed),
  // pointing at the cloned source
  const typedocCmd = [
    'npx typedoc',
    hasConfig ? `--options ${typedocConfig}` : '',
    `--plugin typedoc-plugin-markdown`,
    `--plugin typedoc-plugin-frontmatter`,
    `--entryPoints ${join(tmpDir, 'js')}`,
    `--tsconfig ${typedocTsconfig}`,
    `--out ${outDir}`,
    '--outputFileStrategy modules',
    '--fileExtension .mdx',
    '--hidePageHeader true',
    '--hideBreadcrumbs true',
    '--excludePrivate true',
    '--excludeInternal true',
    '--parametersFormat table',
    '--enumMembersFormat table',
    '--expandObjects true',
    '--entryPointStrategy expand',
    '--skipErrorChecking true',
  ].filter(Boolean).join(' ');

  run(typedocCmd, { cwd: root });

  // Post-process: add frontmatter and clean up paths
  const mdxFiles = readdirSync(outDir, { recursive: true })
    .filter(f => f.endsWith('.mdx') && f !== 'index.mdx');
  for (const file of mdxFiles) {
    const filePath = join(outDir, file);
    let content = readFileSync(filePath, 'utf-8');

    // Extract title from first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : file.replace('.mdx', '');

    // Add frontmatter if missing
    if (!content.startsWith('---')) {
      content = `---\ntitle: ${title}\ndescription: API reference for ${title}\n---\n\n${content}`;
    }

    // Clean up "Defined in" paths (remove /tmp/alizarin-xxx/ prefix)
    content = content.replace(/Defined in: [^\n]*?\/js\//g, 'Defined in: js/');

    writeFileSync(filePath, content);
  }

  // Add meta.json for Fumadocs sidebar
  writeFileSync(
    join(outDir, 'meta.json'),
    JSON.stringify({ title: version === 'stable' ? 'Stable' : 'Alpha' }, null, 2) + '\n'
  );

  // Add index page
  writeFileSync(
    join(outDir, 'index.mdx'),
    [
      '---',
      `title: API Reference (${version === 'stable' ? 'Stable' : 'Alpha'})`,
      `description: Generated API reference for alizarin ${version} release`,
      '---',
      '',
      `This is the auto-generated API reference for the **${version}** version of alizarin.`,
      '',
      version === 'stable'
        ? `Based on tag \`${ref}\`.`
        : 'Based on the latest `main` branch.',
      '',
    ].join('\n')
  );

  // Cleanup
  rmSync(tmpDir, { recursive: true });
  console.log(`Done: ${outDir}`);
}

// Ensure content directory exists
mkdirSync(contentApiDir, { recursive: true });

// Generate alpha (always from main)
generateForVersion('alpha', 'main');

// Generate stable (from latest stable tag, if one exists)
if (STABLE_TAG && STABLE_TAG !== 'v0.0.0') {
  generateForVersion('stable', STABLE_TAG);
} else {
  console.log('\nNo stable tag found, skipping stable API docs.');
  const stableDir = join(contentApiDir, 'stable');
  mkdirSync(stableDir, { recursive: true });
  writeFileSync(
    join(stableDir, 'index.mdx'),
    [
      '---',
      'title: API Reference (Stable)',
      'description: No stable release yet',
      '---',
      '',
      'No stable release has been published yet. Check the [Alpha](/docs/api/alpha) version for the latest API reference.',
      '',
    ].join('\n')
  );
  writeFileSync(
    join(stableDir, 'meta.json'),
    JSON.stringify({ title: 'Stable' }, null, 2) + '\n'
  );
}

console.log('\nAPI docs generation complete.');
