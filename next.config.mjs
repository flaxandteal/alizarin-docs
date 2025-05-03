import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath: '/alizarin-docs',
  reactStrictMode: true,
};

export default withMDX(config);
