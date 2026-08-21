const COMMIT_URL_BASE = 'https://github.com/teplostanski/newround/commit';

const sha = process.env.NEXT_PUBLIC_GIT_SHA ?? '';
const rawDate = process.env.NEXT_PUBLIC_GIT_DATE ?? '';

const formatCommitStamp = (value: string) => {
  const iso = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2})?(Z|[+-]\d{2}:?\d{2})?/.exec(
    value,
  );

  if (!iso) {
    return value;
  }

  const stamp = `${iso[1]} ${iso[2]}`;

  return stamp;
};

export const buildInfo = sha
  ? {
      sha,
      shortSha: sha.slice(0, 7),
      date: formatCommitStamp(rawDate),
      commitUrl: `${COMMIT_URL_BASE}/${sha}`,
    }
  : null;
