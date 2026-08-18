import { execSync } from 'node:child_process';
import { networkInterfaces } from 'node:os';
import type { NextConfig } from 'next';

const localDevOrigins = Object.values(networkInterfaces())
  .flatMap((addresses) => addresses ?? [])
  .filter(({ family, internal }) => family === 'IPv4' && !internal)
  .map(({ address }) => address);

const git = (args: string) => {
  try {
    return execSync(`git ${args}`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: localDevOrigins,
  transpilePackages: ['@awesome.me/webawesome'],
  env: {
    NEXT_PUBLIC_GIT_SHA:
      process.env.NEXT_PUBLIC_GIT_SHA || git('rev-parse HEAD'),
    NEXT_PUBLIC_GIT_DATE:
      process.env.NEXT_PUBLIC_GIT_DATE || git('log -1 --format=%cI'),
  },
};

export default nextConfig;
