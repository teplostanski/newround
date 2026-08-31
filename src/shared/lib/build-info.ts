import { version as packageVersion } from '../../../package.json';

const COMMIT_URL_BASE = 'https://github.com/teplostanski/newround/commit';

export const appVersion = packageVersion;

const sha = process.env.NEXT_PUBLIC_GIT_SHA ?? '';
const rawDate = process.env.NEXT_PUBLIC_GIT_DATE ?? '';

const formatCommitStamp = (value: string) => {
  const iso = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2})?(Z|[+-]\d{2}:?\d{2})?/.exec(
    value,
  );

  if (!iso) {
    return { date: value, dateTime: value };
  }

  return {
    date: iso[1],
    dateTime: `${iso[1]} ${iso[2]}`,
  };
};

const stamp = formatCommitStamp(rawDate);

export const buildInfo = sha
  ? {
      sha,
      shortSha: sha.slice(0, 7),
      date: stamp.date,
      dateTime: stamp.dateTime,
      commitUrl: `${COMMIT_URL_BASE}/${sha}`,
    }
  : null;
