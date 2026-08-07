import { networkInterfaces } from 'node:os';
import type { NextConfig } from 'next';

const localDevOrigins = Object.values(networkInterfaces())
  .flatMap((addresses) => addresses ?? [])
  .filter(({ family, internal }) => family === 'IPv4' && !internal)
  .map(({ address }) => address);

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: localDevOrigins,
  transpilePackages: ['@awesome.me/webawesome'],
};

export default nextConfig;
