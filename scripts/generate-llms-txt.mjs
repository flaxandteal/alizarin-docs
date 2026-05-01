/**
 * Generates public/llms.txt from the LLM reference MDX page.
 * Strips YAML frontmatter and MDX component tags to produce plain text.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const inputPath = join(root, 'content', 'docs', 'llm-reference.mdx');
const outputPath = join(root, 'public', 'llms.txt');

if (!existsSync(inputPath)) {
  console.warn('llm-reference.mdx not found at', inputPath);
  console.warn('Skipping llms.txt generation (docs content may not be synced yet)');
  process.exit(0);
}

let content = readFileSync(inputPath, 'utf-8');

// Strip YAML frontmatter
content = content.replace(/^---\n[\s\S]*?\n---\n/, '');

// Strip MDX import statements
content = content.replace(/^import\s+.*$/gm, '');

// Strip MDX component tags (self-closing and paired)
content = content.replace(/<[A-Z][a-zA-Z]*\s[^>]*\/>/g, '');
content = content.replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '');
content = content.replace(/<[A-Z][a-zA-Z]*[^>]*>/g, '');
content = content.replace(/<\/[A-Z][a-zA-Z]*>/g, '');

// Collapse excessive blank lines
content = content.replace(/\n{3,}/g, '\n\n');

// Trim
content = content.trim() + '\n';

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, content, 'utf-8');
console.log('Generated', outputPath);
